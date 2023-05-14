const MESSAGE = {
  SYSTEM_ERROR: () =>
    `Whoops! Something went wrong. Please contact your system administrator.`,
  PROCESS_SUCCESS: () => "Processing was successful.",
  UPDATE_FAILED: () => `Update processing failed. Please check again.`,
  UPDATE_SUCCESS: () => `Update was successful.`,
  CREATE_FAILED: () => `Registration processing failed. Please check again.`,
  DELETE_CONFIRM: () => `Are you sure you want to delete?`,
  DELETE_SUCCESS: () => `Delete processing was successful`,
  DELETE_FAILED: () =>
    `Delete processing failed. Please check again.`,
    COMMENT_CREATE_SUCCESS: () =>
    `The comment has been successfully created.`,
};

export default MESSAGE;