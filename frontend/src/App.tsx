import React, { useState } from 'react';
import { Button, Grid, Paper, TextField, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { backend } from 'declarations/backend';

const CalculatorPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  background: theme.palette.primary.main,
  borderRadius: '15px',
}));

const DisplayTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-input': {
    color: theme.palette.common.white,
    fontSize: '1.5rem',
    textAlign: 'right',
  },
  '& .MuiInput-underline:before': {
    borderBottomColor: theme.palette.common.white,
  },
}));

const CalcButton = styled(Button)(({ theme }) => ({
  fontSize: '1.25rem',
  margin: theme.spacing(0.5),
}));

const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [calculating, setCalculating] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const performOperation = async (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      setCalculating(true);
      try {
        const result = await backend.calculate(operator, firstOperand, inputValue);
        setDisplay(result.toString());
        setFirstOperand(result);
      } catch (error) {
        setDisplay('Error');
      } finally {
        setCalculating(false);
      }
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  return (
    <CalculatorPaper elevation={3}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <DisplayTextField
            fullWidth
            variant="standard"
            value={calculating ? 'Calculating...' : display}
            disabled
          />
        </Grid>
        {calculating && (
          <Grid item xs={12}>
            <CircularProgress />
          </Grid>
        )}
        <Grid item xs={12}>
          <Grid container>
            {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.'].map((btn) => (
              <Grid item xs={3} key={btn}>
                <CalcButton
                  fullWidth
                  variant="contained"
                  color="secondary"
                  onClick={() => btn === '.' ? inputDecimal() : inputDigit(btn)}
                >
                  {btn}
                </CalcButton>
              </Grid>
            ))}
            <Grid item xs={3}>
              <CalcButton
                fullWidth
                variant="contained"
                color="secondary"
                onClick={clear}
              >
                C
              </CalcButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={3}>
          <CalcButton
            fullWidth
            variant="contained"
            onClick={() => performOperation('+')}
          >
            +
          </CalcButton>
        </Grid>
        <Grid item xs={3}>
          <CalcButton
            fullWidth
            variant="contained"
            onClick={() => performOperation('-')}
          >
            -
          </CalcButton>
        </Grid>
        <Grid item xs={3}>
          <CalcButton
            fullWidth
            variant="contained"
            onClick={() => performOperation('*')}
          >
            *
          </CalcButton>
        </Grid>
        <Grid item xs={3}>
          <CalcButton
            fullWidth
            variant="contained"
            onClick={() => performOperation('/')}
          >
            /
          </CalcButton>
        </Grid>
        <Grid item xs={12}>
          <CalcButton
            fullWidth
            variant="contained"
            onClick={() => performOperation('=')}
          >
            =
          </CalcButton>
        </Grid>
      </Grid>
    </CalculatorPaper>
  );
};

export default App;