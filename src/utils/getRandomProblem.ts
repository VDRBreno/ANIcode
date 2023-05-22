import { IProblem } from '../types/Problem';
import { problems } from '../data/problems.json';

export default function getRandomProblems(quantity: number) {
  const randomProblems: IProblem[] = [];
  const problemsDrawIndexes: number[] = [];
  const problemsLength = problems.length;
  if(problemsLength>quantity)
    throw {
      warn: `A quantidade de problemas solicitada é maior que nosso estoque ;~; (${quantity}/${problemsLength})`
    };

  for(let i=0;i<quantity;i++) {
    let draw = true;
    while(draw) {
      const problemIndex = Math.floor(Math.random() * (problemsLength-1));
      if(!problemsDrawIndexes.includes(problemIndex)) {
        draw=false;
        randomProblems.push(problems[problemIndex]);
        problemsDrawIndexes.push(problemIndex);
      }
    }
  }

  return randomProblems;
}