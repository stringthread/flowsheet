import { NonCriticalError } from 'errors/NonCriticalError';
import { toast as nativeToast, ToastContentProps } from 'react-toastify';

interface ToastContentData {
  title: string;
  description: string | undefined;
}
const ToastContent = (props: ToastContentProps<ToastContentData>) => (
  <div>
    <div className='title'>{props.data?.title}</div>
    {props.data?.description ? <div className='description'>{props.data?.description}</div> : null}
  </div>
);

export const toast = (title: string, description: string | undefined) => {
  nativeToast(ToastContent, {
    data: {
      title: title,
      description: description,
    },
  });
};

export const toastAndLog = (
  title: string,
  description: string | undefined,
  log_msg: string | undefined = undefined,
) => {
  toast(title, description);
  if (log_msg === undefined) log_msg = description;
  console.log(`Toasted - ${title}: ${log_msg}`);
};

export const toastNonCriticalError = (e: NonCriticalError, rethrow: boolean = false) => {
  toastAndLog(e.title, e.toast_msg, e.message);
  if (rethrow) throw e;
};
