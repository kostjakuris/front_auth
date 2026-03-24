'use client';
import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';
import styles from './contextMenu.module.scss';

export interface ContextMenuButton {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
}

export interface MenuProps {
  contextMenu: {
    visible: boolean; x: number; y: number;
  };
  buttons: ContextMenuButton[];
  closeContextMenu: () => void;
}

const ContextMenu: FC<MenuProps> = ({contextMenu, buttons, closeContextMenu}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const menuWidth = menuRef.current?.getBoundingClientRect().width || 200;
  const menuHeight = menuRef.current?.getBoundingClientRect().height || 100;
  console.log(contextMenu,'contextMenu');
  
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
      className={!contextMenu.visible ? 'hidden' : styles.menu}
      style={{
        top: 40,
        left: 20,
      }}>
      {buttons.map((btn, i) => (
        <button key={i} onClick={btn.onClick} className={styles.btn}>
          {btn.icon}{btn.label}
        </button>
      ))}
    </div>
  );
};

export default ContextMenu;
