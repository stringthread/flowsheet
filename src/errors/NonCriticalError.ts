export class NonCriticalError extends Error {
  title: string;
  toast_msg: string | undefined;
  constructor(title: string, toast_msg?: string, log_msg?: string) {
    if (!log_msg) {
      log_msg = `${title}: ${toast_msg}`;
    }
    super(log_msg);
    this.title = title;
    this.toast_msg = toast_msg;
  }
}
