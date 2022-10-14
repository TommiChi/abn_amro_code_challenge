export const pureString = (htmlString: string) => {
  return (htmlString || '').replace(/(\<br)((\s\/)|(\/))(\>)+/g, ' ').replace(/(\<\w+\>)|(\<\/\w+\>)|(\<\w+\s\/\>)|(\<\w+\/\>)/g, '');
}