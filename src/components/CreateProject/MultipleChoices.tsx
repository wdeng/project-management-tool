import React, { useState } from 'react';

interface QuestionOption {
  text: string;
  userTextField: boolean; // If true, this option will display an additional user text field.
}

export interface Question {
  text: string;
  options: QuestionOption[];
}

interface MultipleChoiceModalProps {
  questions: Question[];
  onAnswersSubmit: (answers: { [key: string]: string }) => void; // key is question text, value is user's selected option
}

export const MultipleChoiceQuestions: React.FC<MultipleChoiceModalProps> = ({
  questions,
  onAnswersSubmit,
}) => {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  const handleOptionChange = (questionText: string, optionText: string) => {
    setAnswers({
      ...answers,
      [questionText]: optionText,
    });
  };

  const handleUserTextInput = (questionText: string, userInput: string) => {
    // Append user text input to the selected option
    setAnswers({
      ...answers,
      [questionText]: `${answers[questionText]} - ${userInput}`,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAnswersSubmit(answers);
    setAnswers({}); // reset form
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      {questions.map((question) => (
        <div key={question.text}>
          <h2>{question.text}</h2>
          {question.options.map((option) => (
            <div key={option.text}>
              <label>
                <input
                  type="radio"
                  name={question.text}
                  value={option.text}
                  checked={answers[question.text] === option.text}
                  onChange={() => handleOptionChange(question.text, option.text)}
                />
                {option.text}
              </label>
              {option.userTextField && (
                <input
                  type="text"
                  placeholder="Enter your input"
                  onBlur={(e) =>
                    handleUserTextInput(question.text, e.target.value)
                  }
                />
              )}
            </div>
          ))}
        </div>
      ))}
      <button type="submit" className="w-full p-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors duration-200 ease-in-out">
        Submit
      </button>
    </form>
  );
};
