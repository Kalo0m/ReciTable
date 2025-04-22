import React, { useState } from 'react';
import type { TableData, TableCell as CellData } from '../lib/fakeTableData';

import { Table, TableBody, TableCell, TableRow } from '~/components/ui/table';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';
import { checkAnswer, ValidationResult } from '~/utils/table';

interface InteractiveTableProps {
  data: TableData;
  validationThreshold?: number;
}

type InputState = {
  [rowIndex: number]: {
    [colIndex: number]: {
      value: string;
      validationStatus?: ValidationResult | undefined;
    };
  };
};

export function InteractiveTable({
  data,
  validationThreshold = 1,
}: InteractiveTableProps) {
  const initialInputState: InputState = {};
  data.rows.forEach((row: CellData[], rIdx) => {
    row.forEach((cell: CellData, cIdx) => {
      if (cell.isEditable) {
        if (!initialInputState[rIdx]) initialInputState[rIdx] = {};
        initialInputState[rIdx][cIdx] = {
          value: '',
          validationStatus: undefined,
        };
      }
    });
  });

  const [inputs, setInputs] = useState<InputState>(initialInputState);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number | null>(null);

  const handleInputChange = (rIdx: number, cIdx: number, value: string) => {
    setInputs((prev) => ({
      ...prev,
      [rIdx]: {
        ...prev[rIdx],
        [cIdx]: {
          ...prev[rIdx][cIdx],
          value: value,
          validationStatus: undefined,
        },
      },
    }));
    if (submitted) {
      setSubmitted(false);
      setScore(null);
    }
  };

  const handleSubmit = () => {
    const validatedInputs = JSON.parse(JSON.stringify(inputs));
    let totalScore = 0;
    let maxPossiblePoints = 0;

    data.rows.forEach((row: CellData[], rIdx) => {
      row.forEach((cell: CellData, cIdx) => {
        if (
          cell.isEditable &&
          cell.expectedKeywords &&
          cell.expectedKeywords.length > 0
        ) {
          maxPossiblePoints += 2;
          const userValue = inputs[rIdx]?.[cIdx]?.value || '';
          const status = checkAnswer(
            userValue,
            cell.expectedKeywords,
            validationThreshold,
          );
          validatedInputs[rIdx][cIdx].validationStatus = status;

          if (status === 'exact') {
            totalScore += 2;
          } else if (status === 'typo') {
            totalScore += 1;
          }
        } else if (cell.isEditable) {
          validatedInputs[rIdx][cIdx].validationStatus = 'incorrect';
        }
      });
    });

    setInputs(validatedInputs);
    setSubmitted(true);

    // Calculate and set the score out of 20
    const finalScore =
      maxPossiblePoints > 0 ? (totalScore / maxPossiblePoints) * 20 : 0;
    setScore(Math.round(finalScore * 10) / 10); // Round to one decimal place
  };

  const getInputClassName = (rIdx: number, cIdx: number): string => {
    const inputState = inputs[rIdx]?.[cIdx];
    if (submitted && inputState?.validationStatus) {
      switch (inputState.validationStatus) {
        case 'exact':
          return 'border-green-500 focus-visible:ring-green-500';
        case 'typo':
          return 'border-orange-500 focus-visible:ring-orange-500'; // Orange for typos
        case 'incorrect':
          return 'border-red-500 focus-visible:ring-red-500';
        default:
          return '';
      }
    }
    return '';
  };

  const getScoreColorClass = (currentScore: number | null): string => {
    if (currentScore === null) return 'text-inherit'; // Default color if no score

    if (currentScore >= 15) {
      return 'text-green-500'; // Green for high scores
    } else if (currentScore >= 10) {
      return 'text-orange-500'; // Orange for medium scores
    } else {
      return 'text-red-500'; // Red for low scores
    }
  };

  return (
    <div className="bg-card p-4 rounded-lg shadow-md border">
      <Table>
        <TableBody>
          {data.rows.map((row: CellData[], rIdx) => (
            <TableRow key={rIdx}>
              {row.map((cell: CellData, cIdx) => (
                <TableCell key={`${rIdx}-${cIdx}`}>
                  {cell.isEditable ? (
                    <Input
                      type="text"
                      value={inputs[rIdx]?.[cIdx]?.value || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(rIdx, cIdx, e.target.value)
                      }
                      className={cn('w-full', getInputClassName(rIdx, cIdx))}
                      disabled={
                        submitted &&
                        inputs[rIdx]?.[cIdx]?.validationStatus === 'exact'
                      }
                      aria-label={`Input for row ${rIdx + 1}, column ${cIdx + 1}`}
                    />
                  ) : (
                    <span>{cell.content}</span>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-6 text-center">
        <Button variant={'default'} onClick={handleSubmit} disabled={submitted}>
          Submit Answers
        </Button>
      </div>
      {/* Display Score with dynamic color */}
      {submitted && score !== null && (
        <div className="mt-4 p-3 bg-muted rounded-md text-center">
          <p className="font-semibold text-lg">
            Your Score:
            {/* Apply dynamic color class to the score span */}
            <span className={cn('font-bold', getScoreColorClass(score))}>
              {score.toFixed(1)} / 20
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
