export const ANGOLA_COURTS = [
  'Tribunal Constitucional de Angola',
  'Tribunal Supremo de Angola',
  'Tribunal de Contas de Angola',
  'Tribunal da Relação de Luanda',
  'Tribunal da Relação de Benguela',
  'Tribunal da Relação do Lubango',
  'Tribunal da Comarca de Luanda (Cível e Comercial)',
  'Tribunal da Comarca de Luanda (Trabalho)',
  'Tribunal da Comarca de Luanda (Crime)',
  'Tribunal da Comarca de Belas',
  'Tribunal da Comarca de Cacuaco',
  'Tribunal da Comarca de Viana',
  'Tribunal da Comarca de Benguela',
  'Tribunal da Comarca do Huambo'
];

export const ANGOLA_PROVINCES = [
  'Bengo',
  'Benguela',
  'Bié',
  'Cabinda',
  'Cuando Cubango',
  'Cuanza Norte',
  'Cuanza Sul',
  'Cunene',
  'Huambo',
  'Huíla',
  'Luanda',
  'Lunda Norte',
  'Lunda Sul',
  'Malanje',
  'Moxico',
  'Namibe',
  'Uíge',
  'Zaire'
];

export function formatAOA(amount: number): string {
  return new Intl.NumberFormat('pt-AO', {
    style: 'currency',
    currency: 'AOA',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
    .format(amount)
    .replace('AOA', 'Kz');
}

export function formatNIF(nif: string): string {
  return nif.trim().toUpperCase();
}
