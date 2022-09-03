import React,{useState,useCallback, forwardRef, useRef, useEffect} from 'react';
import {css} from '@emotion/react';

export interface TextInputProps<T extends HTMLElement> {
  onClick?: React.MouseEventHandler<T>,
  onChange?: React.ChangeEventHandler<T>,
  onInput?: React.FormEventHandler<T>,
  onBlur?: React.FocusEventHandler<T>,
  onFocus?: React.FocusEventHandler<T>,
  onKeyPress?: React.KeyboardEventHandler<T>,
  value?: string,
  placeholder?: string,
  key?: React.Key,
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
    key={props.key}
    className={props.className}
    onClick={props.onClick??empty_event_handler}
    onChange={props.onChange??empty_event_handler}
    onInput={props.onInput??empty_event_handler}
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

const updateWidth = (element: HTMLInputElement)=>{
  const minWidth=element.style.minWidth;
  element.style.width='0';
  element.style.minWidth='0';
  element.style.width=element.scrollWidth+'px';
  element.style.minWidth=minWidth;
};

export const StretchTextInput = forwardRef((props: TextInputProps<HTMLInputElement>, ref: React.ForwardedRef<HTMLInputElement>)=>{
  const changeHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>)=>{
    if(props.onChange!==undefined) props.onChange(e);
    updateWidth(e.currentTarget);
  },[props]);
  const inputRef = useRef<HTMLInputElement>(null);
  if(typeof ref==='function') ref(inputRef.current);
  else if(ref!==null) ref.current=inputRef.current;
  useEffect(()=>{
    if(inputRef.current!==null) updateWidth(inputRef.current);
  }, [inputRef.current?.value]);
  return (
    <TextInput
    {...props}
    ref={inputRef}
    onChange={changeHandler}
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
    key={props.key}
    className={props.className}
    onClick={props.onClick??empty_event_handler}
    onChange={props.onChange??empty_event_handler}
    onInput={props.onInput??empty_event_handler}
    onBlur={props.onBlur??empty_event_handler}
    onFocus={props.onFocus??empty_event_handler}
    onKeyPress={props.onKeyPress??empty_event_handler}
    placeholder={props.placeholder??''}
    css={styleTextArea}
    defaultValue={props.value??''} />
  );
});

const styleStretchTextArea=css(
  styleTextArea,
  css`
    min-height: 1em;
  `
);

const updateHeight = (element: HTMLTextAreaElement)=>{
  element.style.height='0px';
  element.style.height=element.scrollHeight+'px';
};

export const StretchTextArea = forwardRef((props: TextInputProps<HTMLTextAreaElement>, ref: React.ForwardedRef<HTMLTextAreaElement>)=>{
  const changeHandler = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>)=>{
      if(props.onChange!==undefined) props.onChange(e);
      updateHeight(e.currentTarget);
    }
  ,[props]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  if(typeof ref==='function') ref(inputRef.current);
  else if(ref!==null) ref.current=inputRef.current;
  useEffect(()=>{
    if(inputRef.current!==null) updateHeight(inputRef.current);
  }, [inputRef.current?.value]);
  return (
    <TextArea {...props}
    ref={ref}
    onChange={changeHandler}
    css={styleStretchTextArea}
    />
  );
});