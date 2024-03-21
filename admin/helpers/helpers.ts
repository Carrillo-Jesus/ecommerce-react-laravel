
export const getDefaultImage = (e: React.SyntheticEvent<HTMLImageElement>, name: string) => {
    e.currentTarget.src = `https://placehold.co/50x50?text=${name}`;
}