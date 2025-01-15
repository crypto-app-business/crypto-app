interface ContractData {
    [amount: string]: {
      weeks: {
        weekNumber: number;
        percentage: number;
      }[];
    };
  }
  
//   const contractData: ContractData = {
    const data: ContractData = {
    "50": {
      weeks: [
        { weekNumber: 24, percentage: 0.9 },
      ],
    },
    "100": {
      weeks: [
        { weekNumber: 24, percentage: 1 },
        { weekNumber: 23, percentage: 1 },
        { weekNumber: 22, percentage: 1 },
        { weekNumber: 21, percentage: 1 },
        { weekNumber: 20, percentage: 1 },
        { weekNumber: 19, percentage: 1 },
        { weekNumber: 18, percentage: 1 },
        { weekNumber: 17, percentage: 1 },
        { weekNumber: 16, percentage: 1 },
        { weekNumber: 15, percentage: 1 },
        { weekNumber: 14, percentage: 0.9 },
      ],
    },
    "250": {
      weeks: [
        { weekNumber: 20, percentage: 1.38 },
        { weekNumber: 19, percentage: 1.28 },
        { weekNumber: 18, percentage: 1.23 },
        { weekNumber: 17, percentage: 1.18 },
        { weekNumber: 16, percentage: 1.13 },
        { weekNumber: 15, percentage: 1.08 },
        { weekNumber: 14, percentage: 1.03 },
      ],
    },
    "500": {
      weeks: [
        { weekNumber: 20, percentage: 1.43 },
        { weekNumber: 19, percentage: 1.33 },
        { weekNumber: 18, percentage: 1.28 },
        { weekNumber: 17, percentage: 1.23 },
        { weekNumber: 16, percentage: 1.18 },
        { weekNumber: 15, percentage: 1.13 },
        { weekNumber: 14, percentage: 1.08 },
      ],
    },
    "1000": {
      weeks: [
        { weekNumber: 20, percentage: 1.48 },
        { weekNumber: 19, percentage: 1.38 },
        { weekNumber: 18, percentage: 1.33 },
        { weekNumber: 17, percentage: 1.28 },
        { weekNumber: 16, percentage: 1.23 },
        { weekNumber: 15, percentage: 1.18 },
        { weekNumber: 14, percentage: 1.13 },
      ],
    },
    "2000": {
      weeks: [
        { weekNumber: 20, percentage: 1.53 },
        { weekNumber: 19, percentage: 1.43 },
        { weekNumber: 18, percentage: 1.38 },
        { weekNumber: 17, percentage: 1.33 },
        { weekNumber: 16, percentage: 1.28 },
        { weekNumber: 15, percentage: 1.23 },
        { weekNumber: 14, percentage: 1.18 },
      ],
    },
    "3000": {
      weeks: [
        { weekNumber: 20, percentage: 1.58 },
        { weekNumber: 19, percentage: 1.48 },
        { weekNumber: 18, percentage: 1.43 },
        { weekNumber: 17, percentage: 1.38 },
        { weekNumber: 16, percentage: 1.33 },
        { weekNumber: 15, percentage: 1.28 },
        { weekNumber: 14, percentage: 1.23 },
      ],
    },
    "4000": {
      weeks: [
        { weekNumber: 20, percentage: 1.63 },
        { weekNumber: 19, percentage: 1.53 },
        { weekNumber: 18, percentage: 1.48 },
        { weekNumber: 17, percentage: 1.43 },
        { weekNumber: 16, percentage: 1.38 },
        { weekNumber: 15, percentage: 1.33 },
        { weekNumber: 14, percentage: 1.28 },
      ],
    },
    "5000": {
      weeks: [
        { weekNumber: 20, percentage: 1.68 },
        { weekNumber: 19, percentage: 1.58 },
        { weekNumber: 18, percentage: 1.53 },
        { weekNumber: 17, percentage: 1.48 },
        { weekNumber: 16, percentage: 1.43 },
        { weekNumber: 15, percentage: 1.38 },
        { weekNumber: 14, percentage: 1.33 },
      ],
    },
    "7500": {
      weeks: [
        { weekNumber: 20, percentage: 1.73 },
        { weekNumber: 19, percentage: 1.63 },
        { weekNumber: 18, percentage: 1.58 },
        { weekNumber: 17, percentage: 1.53 },
        { weekNumber: 16, percentage: 1.48 },
        { weekNumber: 15, percentage: 1.43 },
        { weekNumber: 14, percentage: 1.38 },
      ],
    },
    "10000": {
      weeks: [
        { weekNumber: 20, percentage: 1.81 },
        { weekNumber: 19, percentage: 1.71 },
        { weekNumber: 18, percentage: 1.63 },
        { weekNumber: 17, percentage: 1.61 },
        { weekNumber: 16, percentage: 1.56 },
        { weekNumber: 15, percentage: 1.51 },
        { weekNumber: 14, percentage: 1.46 },
        { weekNumber: 13, percentage: 1.41 },
        { weekNumber: 12, percentage: 1.36 },
        { weekNumber: 11, percentage: 1.31 },
      ],
    },
    "12500": {
      weeks: [
        { weekNumber: 20, percentage: 1.86 },
        { weekNumber: 19, percentage: 1.76 },
        { weekNumber: 18, percentage: 1.71 },
        { weekNumber: 17, percentage: 1.66 },
        { weekNumber: 16, percentage: 1.61 },
        { weekNumber: 15, percentage: 1.56 },
        { weekNumber: 14, percentage: 1.51 },
        { weekNumber: 13, percentage: 1.46 },
        { weekNumber: 12, percentage: 1.41 },
        { weekNumber: 11, percentage: 1.36 },
      ],
    },
    "17500": {
      weeks: [
        { weekNumber: 20, percentage: 1.91 },
        { weekNumber: 19, percentage: 1.81 },
        { weekNumber: 18, percentage: 1.76 },
        { weekNumber: 17, percentage: 1.71 },
        { weekNumber: 16, percentage: 1.66 },
        { weekNumber: 15, percentage: 1.61 },
        { weekNumber: 14, percentage: 1.56 },
        { weekNumber: 13, percentage: 1.51 },
        { weekNumber: 12, percentage: 1.46 },
        { weekNumber: 11, percentage: 1.41 },
      ],
    },
    "25000": {
      weeks: [
        { weekNumber: 20, percentage: 1.96 },
        { weekNumber: 19, percentage: 1.86 },
        { weekNumber: 18, percentage: 1.81 },
        { weekNumber: 17, percentage: 1.76 },
        { weekNumber: 16, percentage: 1.71 },
        { weekNumber: 15, percentage: 1.66 },
        { weekNumber: 14, percentage: 1.61 },
        { weekNumber: 13, percentage: 1.56 },
        { weekNumber: 12, percentage: 1.51 },
        { weekNumber: 11, percentage: 1.46 },
      ],
    },
    "37500": {
      weeks: [
        { weekNumber: 19, percentage: 1.86 },
        { weekNumber: 18, percentage: 1.81 },
        { weekNumber: 17, percentage: 1.76 },
        { weekNumber: 16, percentage: 1.71 },
        { weekNumber: 15, percentage: 1.66 },
        { weekNumber: 14, percentage: 1.61 },
        { weekNumber: 13, percentage: 1.56 },
        { weekNumber: 12, percentage: 1.51 },
        { weekNumber: 11, percentage: 1.46 },
      ],
    },
    "50000": {
      weeks: [
        { weekNumber: 19, percentage: 1.91 },
        { weekNumber: 18, percentage: 1.86 },
        { weekNumber: 17, percentage: 1.81 },
        { weekNumber: 16, percentage: 1.76 },
        { weekNumber: 15, percentage: 1.71 },
        { weekNumber: 14, percentage: 1.66 },
        { weekNumber: 13, percentage: 1.61 },
        { weekNumber: 12, percentage: 1.56 },
        { weekNumber: 11, percentage: 1.51 },
      ],
    },
    "75000": {
      weeks: [
        { weekNumber: 18, percentage: 1.91 },
        { weekNumber: 17, percentage: 1.86 },
        { weekNumber: 16, percentage: 1.81 },
        { weekNumber: 15, percentage: 1.76 },
        { weekNumber: 14, percentage: 1.71 },
        { weekNumber: 13, percentage: 1.66 },
        { weekNumber: 12, percentage: 1.61 },
        { weekNumber: 11, percentage: 1.56 },
        { weekNumber: 10, percentage: 1.51 },
      ],
    },
    "100000": {
      weeks: [
        { weekNumber: 18, percentage: 1.96 },
        { weekNumber: 17, percentage: 1.91 },
        { weekNumber: 16, percentage: 1.86 },
        { weekNumber: 15, percentage: 1.81 },
        { weekNumber: 14, percentage: 1.76 },
        { weekNumber: 13, percentage: 1.71 },
        { weekNumber: 12, percentage: 1.66 },
        { weekNumber: 11, percentage: 1.61 },
        { weekNumber: 10, percentage: 1.56 },
      ],
    },
    "150000": {
      weeks: [
        { weekNumber: 17, percentage: 1.96 },
        { weekNumber: 16, percentage: 1.91 },
        { weekNumber: 15, percentage: 1.86 },
        { weekNumber: 14, percentage: 1.81 },
        { weekNumber: 13, percentage: 1.76 },
        { weekNumber: 12, percentage: 1.71 },
        { weekNumber: 11, percentage: 1.66 },
        { weekNumber: 10, percentage: 1.61 },
      ],
    },
    "200000": {
      weeks: [
        { weekNumber: 17, percentage: 2.01 },
        { weekNumber: 16, percentage: 1.96 },
        { weekNumber: 15, percentage: 1.91 },
        { weekNumber: 14, percentage: 1.86 },
        { weekNumber: 13, percentage: 1.81 },
        { weekNumber: 12, percentage: 1.76 },
        { weekNumber: 11, percentage: 1.71 },
        { weekNumber: 10, percentage: 1.66 },
      ],
    },
    "250000": {
      weeks: [
        { weekNumber: 16, percentage: 2.01 },
        { weekNumber: 15, percentage: 1.96 },
        { weekNumber: 14, percentage: 1.91 },
        { weekNumber: 13, percentage: 1.86 },
        { weekNumber: 12, percentage: 1.81 },
        { weekNumber: 11, percentage: 1.76 },
        { weekNumber: 10, percentage: 1.71 },
      ],
    },
    "375000": {
      weeks: [
        { weekNumber: 15, percentage: 2.06 },
        { weekNumber: 14, percentage: 2.01 },
        { weekNumber: 13, percentage: 1.96 },
        { weekNumber: 12, percentage: 1.91 },
        { weekNumber: 11, percentage: 1.86 },
        { weekNumber: 10, percentage: 1.81 },
      ],
    },
    "500000": {
      weeks: [
        { weekNumber: 14, percentage: 2.06 },
        { weekNumber: 13, percentage: 2.01 },
        { weekNumber: 12, percentage: 1.96 },
        { weekNumber: 11, percentage: 1.91 },
        { weekNumber: 10, percentage: 1.86 },
        { weekNumber: 9, percentage: 1.81 },
      ],
    },
    "625000": {
      weeks: [
        { weekNumber: 13, percentage: 2.11 },
        { weekNumber: 12, percentage: 2.06 },
        { weekNumber: 11, percentage: 2.01 },
        { weekNumber: 10, percentage: 1.96 },
        { weekNumber: 9, percentage: 1.91 },
        { weekNumber: 8, percentage: 1.86 },
      ],
    },
    "750000": {
      weeks: [
        { weekNumber: 12, percentage: 2.11 },
        { weekNumber: 11, percentage: 2.06 },
        { weekNumber: 10, percentage: 2.01 },
        { weekNumber: 9, percentage: 1.96 },
        { weekNumber: 8, percentage: 1.91 },
      ],
    },
    "1000000": {
      weeks: [
        { weekNumber: 11, percentage: 2.16 },
        { weekNumber: 10, percentage: 2.11 },
        { weekNumber: 9, percentage: 2.06 },
        { weekNumber: 8, percentage: 2.01 },
        { weekNumber: 7, percentage: 1.96 },
      ],
    },
  };
  
//   export default contractData;  
export default function contractData(): ContractData {
    return data;
  }