export type Person = {
  id: string;
  name: string;
  born?: number;
  spouse?: Person;
  spouseStatus?: 'married' | 'divorced';
  adopted?: boolean;
  children?: Person[];
};

