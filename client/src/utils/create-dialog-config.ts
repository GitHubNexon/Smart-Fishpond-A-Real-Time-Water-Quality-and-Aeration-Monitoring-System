const createDialogConfig = (
  title: string,
  description: string,
  proceed: string,
  icon: React.ReactNode,
  action: () => void,
) => ({
  title,
  description,
  proceed,
  cancel: 'Cancel',
  icon,
  action,
});

export default createDialogConfig;
