import { buttonStyles, checkboxStyles } from '../../utils/tailwindStyles';
import { QuestionChoices } from '@/apis';
import React, { useState } from 'react';

interface MultipleChoiceModalProps {
  questions:  QuestionChoices[];
  onAnswersSubmit: (answers: { question: string; answers: string[] }[]) => void;
}

export const MultipleChoiceQuestions: React.FC<MultipleChoiceModalProps> = ({ 
  questions,
  onAnswersSubmit,
}) => {
  const [answers, setAnswers] = useState<{ [key: string]: { option: string; userInput: string }[] }>({});

  const handleOptionChange = (questionText: string, optionText: string, checked: boolean) => {
    if (checked) {
      setAnswers({
        ...answers,
        [questionText]: [...(answers[questionText] || []), { option: optionText, userInput: '' }],
      });
    } else {
      setAnswers({
        ...answers,
        [questionText]: (answers[questionText] || []).filter((answer) => answer.option !== optionText),
      });
    }
  };

  const handleUserTextInput = (questionText: string, optionText: string, userInput: string) => {
    const newAnswers = (answers[questionText] || []).map((answer) =>
      answer.option === optionText ? { option: optionText, userInput } : answer
    );
    if (!newAnswers.some((answer) => answer.option === optionText) && userInput !== '') {
      newAnswers.push({ option: optionText, userInput });
    }
    setAnswers({ ...answers, [questionText]: newAnswers });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAnswersSubmit(convertAnswersFormat(answers));
    setAnswers({}); // reset form
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      {questions.map((question) => (
        <div key={question.text}>
          <h2 className='font-medium pt-3'>{question.text}</h2>
          {question.options.map((option) => (
            <div key={option.text} className='flex items-center mx-3 my-2'>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name={question.text}
                  value={option.text}
                  checked={(answers[question.text] || []).some((answer) => answer.option === option.text)}
                  onChange={(e) => handleOptionChange(question.text, option.text, e.target.checked)}
                  className={`${checkboxStyles} mr-3`}
                />
                {!option.userTextField && option.text}
              </label>
              {option.userTextField && (
                <input
                  type="text"
                  name={question.text + ' userInput'}
                  placeholder={option.text}
                  value={
                    (answers[question.text] || []).find(answer => answer.option === option.text)?.userInput || ''
                  }
                  onChange={(e) =>
                    handleUserTextInput(question.text, option.text, e.target.value)
                  }
                  className='bg-transparent focus:ring-0 border-0 border-b-2 border-gray-400 p-0 w-64'
                />
              )}
            </div>
          ))}
        </div>
      ))}
      <button type="submit" className={`w-full ${buttonStyles}`}>
        Submit
      </button>
    </form>
  );
};

const convertAnswersFormat = (answers: { [key: string]: { option: string; userInput: string }[] }) => {
  let convertedAnswers = [];

  for (let question in answers) {
    let answerOptions = answers[question].map((answer) => answer.userInput || answer.option);
    convertedAnswers.push({ question: question, answers: answerOptions });
  }

  return convertedAnswers;
};
