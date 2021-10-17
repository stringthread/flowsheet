import React from 'react';
import {css} from '@emotion/react';

export interface TextInputProps<T extends HTMLElement> {
  onClick?: React.MouseEventHandler<T>,
  onChange?: React.ChangeEventHandler<T>,
  onBlur?: React.FocusEventHandler<T>,
  onFocus?: React.FocusEventHandler<T>,
  onKeyPress?: React.KeyboardEventHandler<T>,
  value?: string,
  placeholder?: string,
  id?: string,
  className?: string,
}

const empty_event_handler: React.EventHandler<React.SyntheticEvent>=()=>{};

const styleTextInput=css`
  border: solid 1px #ddd;
  border-radius: 0;
  &:placeholder-shown{
    border: none;
    background-color: #eee;
  }
  &:focus{
    border: solid 1px #aaa;
    background: none;
    outline: none;
  }
`;

export const TextInput: React.VFC<TextInputProps<HTMLInputElement>> = (props)=>{
  return (
    <input type="text"
    id={props.id}
    className={props.className}
    onClick={props.onClick??empty_event_handler}
    onChange={props.onChange??empty_event_handler}
    onBlur={props.onBlur??empty_event_handler}
    onFocus={props.onFocus??empty_event_handler}
    onKeyPress={props.onKeyPress??empty_event_handler}
    defaultValue={props.value??''}
    placeholder={props.placeholder??' '}
    css={styleTextInput} />
  );
};

const styleTextArea=css(
  styleTextInput,
  css`
    resize: none;
  `
);

export const TextArea: React.VFC<TextInputProps<HTMLTextAreaElement>> = (props)=>{
  return (
    <textarea
    id={props.id}
    className={props.className}
    onClick={props.onClick??empty_event_handler}
    onChange={props.onChange??empty_event_handler}
    onBlur={props.onBlur??empty_event_handler}
    onFocus={props.onFocus??empty_event_handler}
    onKeyPress={props.onKeyPress??empty_event_handler}
    placeholder={props.placeholder??''}
    css={styleTextArea} >
      {props.value??''}
    </textarea>
  );
};
