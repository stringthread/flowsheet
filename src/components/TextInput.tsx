import React from 'react';

export interface TextInputProps {
  onClick?: React.MouseEventHandler<HTMLElement>,
  onChange?: React.ChangeEventHandler<HTMLElement>,
  onBlur?: React.FocusEventHandler<HTMLElement>,
  onFocus?: React.FocusEventHandler<HTMLElement>,
  onKeyPress?: React.KeyboardEventHandler<HTMLElement>,
  value?: string,
  placeholder?: string,
}

const empty_event_handler: React.EventHandler<React.SyntheticEvent>=()=>{};

export const TextInput: React.VFC<TextInputProps> = (props)=>{
  return (
    <input type="text"
    onClick={props.onClick??empty_event_handler}
    onChange={props.onChange??empty_event_handler}
    onBlur={props.onBlur??empty_event_handler}
    onFocus={props.onFocus??empty_event_handler}
    onKeyPress={props.onKeyPress??empty_event_handler}
    defaultValue={props.value??''}
    placeholder={props.placeholder??''} />
  );
};

export const TextArea: React.VFC<TextInputProps> = (props)=>{
  return (
    <textarea
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
