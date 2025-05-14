export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const convertAmericanToDecimal = (americanOdds: number): number => {
  if (americanOdds > 0) {
    return +(americanOdds / 100 + 1).toFixed(2);
  } else {
    return +(100 / Math.abs(americanOdds) + 1).toFixed(2);
  }
};
