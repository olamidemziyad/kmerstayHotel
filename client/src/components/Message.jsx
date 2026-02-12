function Message({ type = "error", children }) {
  const baseStyle = "p-2 rounded mb-4 text-sm";
  const styles = {
    success: `${baseStyle} bg-green-100 text-green-800 border border-green-300`,
    error: `${baseStyle} bg-red-100 text-red-800 border border-red-300`,
    info: `${baseStyle} bg-blue-100 text-blue-800 border border-blue-300`,
  };

  return <div className={styles[type]}>{children}</div>;
}

export default Message;
