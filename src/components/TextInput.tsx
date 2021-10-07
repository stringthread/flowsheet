import React from 'react';

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
    placeholder={props.placeholder??''} />
  );
};

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
    placeholder={props.placeholder??''} >
      {props.value??''}
    </textarea>
  );
};
