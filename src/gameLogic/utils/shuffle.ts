const shuffleArray = <T>(array: Array<T>) => {
  const newArray = [...array];

  for (let i = newArray.length - 1; i > 0; i--) {
    const n = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[n]] = [newArray[n], newArray[i]];
  }
  return newArray;
};

export default shuffleArray;
