import LeaderLine from 'leader-line-new';

const defaultOptions: LeaderLine.Options = {
  color: '#999',
  size: 2,
  path: 'straight',
  startPlug: 'behind',
  endPlug: 'behind',
};

export const createLeaderLine = (
  start: Element | LeaderLine.AnchorAttachment,
  end: Element | LeaderLine.AnchorAttachment,
  options?: LeaderLine.Options | undefined,
): LeaderLine => {
  return new LeaderLine(start, end, {
    ...defaultOptions,
    ...options,
  });
};
