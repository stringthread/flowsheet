import React,{useState,useCallback, forwardRef} from 'react';
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
  css?: ReturnType<typeof css>,
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

export const TextInput = forwardRef((props: TextInputProps<HTMLInputElement>, ref: React.ForwardedRef<HTMLInputElement>)=>{
  return (
    <input type="text"
    ref={ref}
    id={props.id}
    className={props.className}
    onClick={props.onClick??empty_event_handler}
    onChange={props.onChange??empty_event_handler}
    onBlur={props.onBlur??empty_event_handler}
    onFocus={props.onFocus??empty_event_handler}
    onKeyPress={props.onKeyPress??empty_event_handler}
    defaultValue={props.value??''}
    placeholder={props.placeholder??' '}
    css={css(props.css,styleTextInput)} />
  );
});

const styleStretchTextInput=css`
  width: 0;
`;

export const StretchTextInput = forwardRef((props: TextInputProps<HTMLInputElement>, ref: React.ForwardedRef<HTMLInputElement>)=>{
  return (
    <TextInput
    {...props}
    ref={ref}
    onChange={
      useCallback((e: React.ChangeEvent<HTMLInputElement>)=>{
        if(props.onChange!==undefined) props.onChange(e);
        const minWidth=e.currentTarget.style.minWidth
        e.currentTarget.style.width='0';
        e.currentTarget.style.minWidth='0';
        e.currentTarget.style.width=e.currentTarget.scrollWidth+'px';
        e.currentTarget.style.minWidth=minWidth;
      },[props])
    }
    css={css(props.css,styleStretchTextInput)} />
  )
});

const styleTextArea=css(
  styleTextInput,
  css`
    resize: none;
  `
);

export const TextArea = forwardRef((props: TextInputProps<HTMLTextAreaElement>, ref: React.ForwardedRef<HTMLTextAreaElement>)=>{
  return (
    <textarea
    ref={ref}
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
});

const styleStretchTextArea=css(
  styleTextArea,
  css`
    box-sizing: content-box;
    height: 1em;
  `
);

export const StretchTextArea = forwardRef((props: TextInputProps<HTMLTextAreaElement>, ref: React.ForwardedRef<HTMLTextAreaElement>)=>{
  return (
    <TextArea {...props}
    ref={ref}
    onChange={useCallback(
      (e)=>{
        if(props.onChange!==undefined) props.onChange(e);
        const minHeight=e.currentTarget.style.minHeight
        e.currentTarget.style.height='0';
        e.currentTarget.style.minHeight='0';
        e.currentTarget.style.height=e.currentTarget.scrollHeight+'px';
        e.currentTarget.style.minHeight=minHeight;
      }
    ,[props])}
    css={styleStretchTextArea}
     />
  );
});