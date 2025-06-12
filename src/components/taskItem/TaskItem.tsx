'use client';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import styles from '../taskList/task-list.module.scss';
import { setPrevCreateSubTask, setPrevEditTask } from '../../lib/slice';
import { useAppDispatch } from '../../lib/hooks';
import { Create } from '../../../public/images/Create';
import { Edit } from '../../../public/images/Edit';
import { Delete } from '../../../public/images/Delete';
import { useDeleteTaskMutation, useEditTaskPositionMutation } from '../../lib/userApi';
import { useDrag, useDrop } from 'react-dnd';
import { Identifier, XYCoord } from 'dnd-core';
import update from 'immutability-helper';

interface TaskItemProps {
  id: number;
  index: number;
  name: string;
  status: string;
  parentId: number | null;
  description: string;
  subTasks: any[];
  taskList?: any[];
  moveTask: (dragIndex: number, hoverIndex: number) => void | null;
}

interface DragItem {
  id: number;
  index: number;
  name: string;
  status: string;
  parentId: number | null;
  description: string;
}

export const ItemTypes = {
  TASK: 'task',
  SUBTASK: 'subtask',
};

const TaskItem: FC<TaskItemProps> = ({
  id,
  name,
  index,
  status,
  parentId,
  description,
  subTasks,
  moveTask,
  taskList,
}) => {
  const dispatch = useAppDispatch();
  const [deleteTask] = useDeleteTaskMutation();
  const [correctSubTasks, setCorrectSubTasks] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const [editTaskPosition] = useEditTaskPositionMutation();
  
  
  const [{handlerId}, drop] = useDrop<
    DragItem,
    void,
    {handlerId: Identifier | null}
  >({
    accept: [ItemTypes.TASK, ItemTypes.SUBTASK],
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      
      if (dragIndex === hoverIndex) {
        return;
      }
      
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      
      const clientOffset = monitor.getClientOffset();
      
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
      
      
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      
      moveTask(dragIndex, hoverIndex);
      
      item.index = hoverIndex;
    },
  });
  const isSubTask = parentId !== null;
  
  const [{isDragging}, drag] = useDrag({
    type: isSubTask ? ItemTypes.SUBTASK : ItemTypes.TASK,
    item: () => {
      return {id, index, parentId};
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  const opacity = isDragging ? 0 : 1;
  
  function closeTasks() {
    if (!isOpen) {
      setIsOpen(true);
      requestAnimationFrame(() => setIsActive(true));
    } else {
      setIsActive(false);
      const visibilityTimeout = setTimeout(() => {
        setIsOpen(false);
      }, 300);
      return () => clearTimeout(visibilityTimeout);
    }
  }
  
  const moveSubTask = useCallback((dragIndex: number, hoverIndex: number) => {
    setCorrectSubTasks((prevTasks: any[]) =>
      update(prevTasks, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevTasks[dragIndex]],
        ],
      }),
    );
  }, []);
  drag(drop(ref));
  
  const changeTaskPosition = async(taskList: any[]) => {
    await editTaskPosition({
      list: taskList
    });
  };
  
  const changeSubTaskPosition = async() => {
    await editTaskPosition({
      list: correctSubTasks
    });
  };
  
  useEffect(() => {
    if (subTasks) {
      setCorrectSubTasks(subTasks.map(element => element));
    }
  }, [subTasks]);
  
  
  return (
    <>
      <div
        className={styles.task__container}
        ref={ref}
        style={{opacity}} data-handler-id={handlerId}
        onDragEndCapture={async() => {
          if (!isSubTask) {
            await changeTaskPosition(taskList || []);
          }
        }}
      >
        <div className={styles.task__content}>
          <p className={styles.task__title}>{name}</p>
          <p className={styles.task__text}>Status: {status}</p>
          <div className={styles.task__buttons}>
            <button className={'cursor-pointer h-10'} onClick={() => dispatch(setPrevCreateSubTask(id))}>
              <Create />
            </button>
            <button className={'cursor-pointer h-10'}
              onClick={() => dispatch(setPrevEditTask(id))}>
              <Edit />
            </button>
            <button className={'cursor-pointer h-10'}
              onClick={async() => await deleteTask(id)}>
              <Delete />
            </button>
            <button className={styles.task__button} onClick={closeTasks} disabled={correctSubTasks.length === 0}>
              All tasks
            </button>
          </div>
        </div>
        <p className={`${styles.task__text} text-left w-full px-5 mb-8`}>Description: {description}</p>
      </div>
      {
        correctSubTasks.length > 0 ?
          correctSubTasks.map((element: any, index) =>
            <div key={element.id} className={`${styles.task} ${isActive ? styles.task__active : ''}
            ${!isOpen ? styles.task__disabled : ''}`}
              onDragEndCapture={async() => await changeSubTaskPosition()}
            >
              <TaskItem
                id={element.id}
                index={index}
                name={element.name}
                status={element.status}
                parentId={element.parentId}
                description={element.description}
                subTasks={element.subTasks}
                moveTask={moveSubTask}
              />
            </div>
          )
          : null
      }
    </>
  );
};

export default TaskItem;