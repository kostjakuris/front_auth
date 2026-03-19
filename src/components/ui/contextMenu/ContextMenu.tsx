'use client';
import React, { FC, ReactNode, useEffect, useRef } from 'react';
import styles from '../../authorizedPage/authorized.module.scss';

export interface ContextMenuButton {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
}

export interface MenuProps {
  contextMenu: {
    visible: boolean; x: number; y: number, dynamicPosition?: boolean
  };
  buttons: ContextMenuButton[];
  closeContextMenu: () => void;
}

const ContextMenu: FC<MenuProps> = ({contextMenu, buttons, closeContextMenu}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const menuWidth = menuRef.current?.getBoundingClientRect().width || 200;
  const menuHeight = menuRef.current?.getBoundingClientRect().height || 100;
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && contextMenu.visible) {
        closeContextMenu();
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu.visible]);
  
  if (!contextMenu.visible && !menuRef.current) {
    return null;
  }
  
  return (
    <div
      ref={menuRef}
      className={!contextMenu.visible ? 'hidden' : styles.authorized__chat_menu}
      style={{
        overflow: 'hidden',
        top: contextMenu.y - window.innerHeight <= 200 && contextMenu.dynamicPosition ? contextMenu.y - menuHeight :
          contextMenu.y,
        left: contextMenu.x <= 200 && contextMenu.dynamicPosition ? contextMenu.x + menuWidth / 3 : contextMenu.x - menuWidth,
      }}>
      {buttons.map((btn, i) => (
        <button key={i} onClick={btn.onClick} className={styles.authorized__chat_btn}>
          {btn.icon}{btn.label}
        </button>
      ))}
    </div>
  );
};

export default ContextMenu;
