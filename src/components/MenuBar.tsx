import { css } from '@emotion/react';
import React from 'react';

const menuVertivalPadding = '10px';

type MenuItemCallback = () => void;
interface MenuItemProps {
  label: string;
  onClick: MenuItemCallback;
}
const menuItemStyle = css`
  padding: 0.25em 0.5em;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  &:hover {
    background-color: #ccc;
  }
`;

export const MenuItem: React.FC<MenuItemProps> = (props) => (
  <li className='menuItem' onClick={props.onClick} css={menuItemStyle} aria-label={props.label}>
    {props.label}
  </li>
);

interface MenuItemListProps {
  items: MenuItemProps[];
}
const menuItemListStyle = css`
  position: absolute;
  left: 0;
  top: calc(1em + ${menuVertivalPadding} * 2);
  width: 15em;
  padding: 0;
  background-color: #e6e6e6;
  box-shadow: 0 0 1em 5px rgba(0, 0, 0, 0.2);
  list-style-type: none;
`;
export const MenuItemList: React.FC<MenuItemListProps> = (props) => {
  return (
    <ul className='menuItemList' css={menuItemListStyle}>
      {props.items.map((v) => (
        <MenuItem label={v.label} onClick={v.onClick} key={v.label} />
      ))}
    </ul>
  );
};

interface MenuBarProps {
  items: {
    label: string;
    items: MenuItemListProps['items'];
  }[];
}
const menuBarStyle = css`
  position: sticky;
  top: 0;
  left: 0;
  width: 100vw;
  height: calc(1em + ${menuVertivalPadding} * 2);
  margin: 0;
  padding: ${menuVertivalPadding} 0;
  background-color: #e6e6e6;
  box-shadow: 0 0 1em 5px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  list-style-type: none;
`;
const menuStyle = css`
  position: relative;
  padding: ${menuVertivalPadding} 1em;
  & > ul {
    visibility: hidden;
  }
  &:hover > ul,
  & > ul.open {
    visibility: visible;
  }
`;
const onMenuClick = (e: React.MouseEvent) => {
  const items = e.currentTarget.querySelector('ul');
  if (items === null) {
    console.error('No child MenuItemList found');
    return;
  }
  items.classList.toggle('open');
};
export const MenuBar: React.FC<MenuBarProps> = (props) => {
  return (
    <ul className='menuBar' css={menuBarStyle}>
      {props.items.map((v) => (
        <li className='menu' key={v.label} css={menuStyle} onClick={onMenuClick}>
          {v.label}
          <MenuItemList items={v.items} />
        </li>
      ))}
    </ul>
  );
};
