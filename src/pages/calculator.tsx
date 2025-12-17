import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import styles from '@/styles/Calculator.module.css';

// --- Main Calculator Component ---
const MainCalculator = () => {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState('');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [memory, setMemory] = useState<number>(0);

  const handleKeyDown = (event: KeyboardEvent) => {
    const { key } = event;
    if (key >= '0' && key <= '9') handleDigitClick(key);
    else if (['+', '-', '*', '/'].includes(key)) handleOperatorClick(key);
    else if (key === '.') handleDecimalClick();
    else if (key === 'Enter' || key === '=') {
      event.preventDefault();
      handleEqualsClick();
    } else if (key === 'Backspace') handleBackspace();
    else if (key === 'Escape') handleClearClick();
    else if (key === '%') handleUnaryOperatorClick('%');
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [display, firstOperand, operator, waitingForSecondOperand]);

  const handleDigitClick = (digit: string) => {
    if (display === 'Error') {
      setDisplay(digit);
      setHistory('');
      return;
    }
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };
  
  const handleOperatorClick = (nextOperator: string) => {
    if (display === 'Error') return;
    const inputValue = parseFloat(display);

    if (operator && !waitingForSecondOperand && firstOperand !== null) {
      const result = calculate(firstOperand, inputValue, operator);
      if (result === 'Error') {
        setDisplay('Error');
        setHistory('');
        return;
      }
      setDisplay(String(result));
      setFirstOperand(result);
      setHistory(String(result) + ' ' + nextOperator);
    } else {
      setFirstOperand(inputValue);
      setHistory(display + ' ' + nextOperator);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (first: number, second: number, op: string): number | 'Error' => {
    switch (op) {
      case '+': return first + second;
      case '-': return first - second;
      case '*': return first * second;
      case '/':
        if (second === 0) return 'Error';
        return first / second;
      case '^': return Math.pow(first, second);
      default: return second;
    }
  };
  
  const handleUnaryOperatorClick = (unaryOperator: string) => {
    if (display === 'Error') return;
    const inputValue = parseFloat(display);
    let result: number | 'Error' = 0;
    switch (unaryOperator) {
        case 'sin': result = Math.sin(inputValue * Math.PI / 180); break;
        case 'cos': result = Math.cos(inputValue * Math.PI / 180); break;
        case 'tan': result = Math.tan(inputValue * Math.PI / 180); break;
        case 'log': result = Math.log10(inputValue); break;
        case 'ln': result = Math.log(inputValue); break;
        case 'sqrt': result = Math.sqrt(inputValue); break;
        case 'sqr': result = Math.pow(inputValue, 2); break;
        case '%': result = inputValue / 100; break;
        case '1/x': 
          if(inputValue === 0) {
            result = 'Error';
          } else {
            result = 1 / inputValue;
          }
          break;
        case '+/-': result = inputValue * -1; break;
    }

    if (result === 'Error' || isNaN(result as number) || result === Infinity || result === -Infinity) {
      setDisplay('Error');
      setHistory('');
    } else {
      setDisplay(String(result));
      setHistory(`${unaryOperator}(${inputValue})`);
    }
    setWaitingForSecondOperand(true);
  };
  
  const handleEqualsClick = () => {
    if (display === 'Error' || operator === null || firstOperand === null || waitingForSecondOperand) return;
    
    const inputValue = parseFloat(display);
    const result = calculate(firstOperand, inputValue, operator);

    if (result === 'Error') {
      setDisplay('Error');
      setHistory('');
    } else {
      setHistory(`${firstOperand} ${operator} ${inputValue} =`);
      setDisplay(String(result));
    }

    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const handleClearClick = () => {
    setDisplay('0');
    setHistory('');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const handleDecimalClick = () => {
    if (display === 'Error') return;
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };
  
  const handleBackspace = () => {
    if (waitingForSecondOperand || display === 'Error') return;
    setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
  }

  const handleMemoryClick = (memOp: 'M+' | 'M-' | 'MR' | 'MC') => {
    if (display === 'Error') return;
    const currentValue = parseFloat(display);
    switch(memOp) {
      case 'M+': setMemory(memory + currentValue); break;
      case 'M-': setMemory(memory - currentValue); break;
      case 'MR': setDisplay(String(memory)); break;
      case 'MC': setMemory(0); break;
    }
     setWaitingForSecondOperand(true);
  };
  
  const handleConstantClick = (constant: 'π' | 'e') => {
    const value = constant === 'π' ? Math.PI : Math.E;
    setDisplay(String(value));
    setWaitingForSecondOperand(false);
  }

  return (
    <>
      <div className={styles.displayWrapper}>
        <div className={styles.history}>{history || ' '}</div>
        <Input
          type="text"
          className={styles.displayInput}
          value={display}
          readOnly
          aria-label="Calculator display"
        />
      </div>
      <div className={styles.grid}>
        <Button variant="outline" onClick={() => handleUnaryOperatorClick('sqr')}>x²</Button>
        <Button variant="outline" onClick={() => handleOperatorClick('^')}>xʸ</Button>
        <Button variant="outline" onClick={() => handleUnaryOperatorClick('sin')}>sin</Button>
        <Button variant="outline" onClick={() => handleUnaryOperatorClick('cos')}>cos</Button>
        <Button variant="outline" onClick={() => handleUnaryOperatorClick('tan')}>tan</Button>

        <Button variant="outline" onClick={() => handleUnaryOperatorClick('sqrt')}>√</Button>
        <Button variant="outline" onClick={() => handleConstantClick('π')}>π</Button>
        <Button variant="outline" onClick={() => handleUnaryOperatorClick('log')}>log</Button>
        <Button variant="outline" onClick={() => handleUnaryOperatorClick('ln')}>ln</Button>
        <Button variant="outline" onClick={() => handleConstantClick('e')}>e</Button>
        
        <Button variant="secondary" onClick={handleClearClick}>C</Button>
        <Button variant="secondary" onClick={() => handleUnaryOperatorClick('+/-')}>+/-</Button>
        <Button variant="secondary" onClick={() => handleUnaryOperatorClick('%')}>%</Button>
        <Button variant="secondary" size="icon" onClick={handleBackspace}><ChevronLeft /></Button>
        <Button variant="destructive" onClick={() => handleOperatorClick('/')}>÷</Button>
        
        <Button variant="outline" onClick={() => handleMemoryClick('MC')}>MC</Button>
        <Button onClick={() => handleDigitClick('7')}>7</Button>
        <Button onClick={() => handleDigitClick('8')}>8</Button>
        <Button onClick={() => handleDigitClick('9')}>9</Button>
        <Button variant="destructive" onClick={() => handleOperatorClick('*')}>×</Button>

        <Button variant="outline" onClick={() => handleMemoryClick('MR')}>MR</Button>
        <Button onClick={() => handleDigitClick('4')}>4</Button>
        <Button onClick={() => handleDigitClick('5')}>5</Button>
        <Button onClick={() => handleDigitClick('6')}>6</Button>
        <Button variant="destructive" onClick={() => handleOperatorClick('-')}>-</Button>

        <Button variant="outline" onClick={() => handleMemoryClick('M+')}>M+</Button>
        <Button onClick={() => handleDigitClick('1')}>1</Button>
        <Button onClick={() => handleDigitClick('2')}>2</Button>
        <Button onClick={() => handleDigitClick('3')}>3</Button>
        <Button variant="destructive" onClick={() => handleOperatorClick('+')}>+</Button>

        <Button variant="outline" onClick={() => handleMemoryClick('M-')}>M-</Button>
        <Button className={styles.colSpan2} onClick={() => handleDigitClick('0')}>0</Button>
        <Button onClick={handleDecimalClick}>.</Button>
        <Button variant="default" className="bg-green-600 hover:bg-green-700" onClick={handleEqualsClick}>=</Button>
      </div>
    </>
  );
};


// --- Unit Converter Data and Logic ---
const conversionFactors: Record<string, Record<string, number>> = {
  Length: {
    Meters: 1,
    Kilometers: 0.001,
    Centimeters: 100,
    Millimeters: 1000,
    Miles: 0.000621371,
    Yards: 1.09361,
    Feet: 3.28084,
    Inches: 39.3701,
  },
  Weight: {
    Kilograms: 1,
    Grams: 1000,
    Milligrams: 1000000,
    Pounds: 2.20462,
    Ounces: 35.274,
  },
  Temperature: {
    Celsius: 1,
    Fahrenheit: 1, // Special handling
    Kelvin: 1,     // Special handling
  },
  Currency: { // Note: These are mock rates relative to USD. For real apps, use an API.
    'USD (United States Dollar)': 1,
    'EUR (Euro)': 0.92,
    'JPY (Japanese Yen)': 157.34,
    'GBP (British Pound)': 0.78,
    'AUD (Australian Dollar)': 1.50,
    'CAD (Canadian Dollar)': 1.37,
    'CHF (Swiss Franc)': 0.90,
    'CNY (Chinese Yuan)': 7.25,
    'INR (Indian Rupee)': 83.54,
    'BRL (Brazilian Real)': 5.25,
    'RUB (Russian Ruble)': 90.33,
    'ZAR (South African Rand)': 18.75,
    'UGX (Ugandan Shilling)': 3740.00,
  }
};

const conversionOptions: Record<string, string[]> = {
  Length: Object.keys(conversionFactors.Length),
  Weight: Object.keys(conversionFactors.Weight),
  Temperature: Object.keys(conversionFactors.Temperature),
  Currency: Object.keys(conversionFactors.Currency),
};

const convertValue = (
  value: number,
  fromUnit: string,
  toUnit: string,
  category: string
): number => {
  if (fromUnit === toUnit) return value;

  if (category === 'Temperature') {
    if (fromUnit === 'Celsius' && toUnit === 'Fahrenheit') return (value * 9/5) + 32;
    if (fromUnit === 'Fahrenheit' && toUnit === 'Celsius') return (value - 32) * 5/9;
    if (fromUnit === 'Celsius' && toUnit === 'Kelvin') return value + 273.15;
    if (fromUnit === 'Kelvin' && toUnit === 'Celsius') return value - 273.15;
    if (fromUnit === 'Fahrenheit' && toUnit === 'Kelvin') return ((value - 32) * 5/9) + 273.15;
    if (fromUnit === 'Kelvin' && toUnit === 'Fahrenheit') return ((value - 273.15) * 9/5) + 32;
    return value; // Should not happen with same from/to unit check
  } else {
    // This logic now works for Length, Weight, and Currency
    const fromFactor = conversionFactors[category][fromUnit];
    const toFactor = conversionFactors[category][toUnit];
    const valueInBase = value / fromFactor; // Convert 'from' amount to base unit (USD for currency)
    return valueInBase * toFactor; // Convert from base unit to 'to' unit
  }
};


// --- Unit Converter Component ---
const UnitConverter = () => {
    const [category, setCategory] = useState<string>('Length');
    const [fromUnit, setFromUnit] = useState<string>(conversionOptions['Length'][0]);
    const [toUnit, setToUnit] = useState<string>(conversionOptions['Length'][1]);
    const [fromValue, setFromValue] = useState<string>('1');
    const [toValue, setToValue] = useState<string>('');

    const currentUnits = useMemo(() => conversionOptions[category], [category]);
    
    useEffect(() => {
        setFromUnit(currentUnits[0]);
        setToUnit(currentUnits.length > 1 ? currentUnits[1] : currentUnits[0]);
    }, [category, currentUnits]);

    useEffect(() => {
        const fromNumber = parseFloat(fromValue);
        if (!isNaN(fromNumber)) {
            const result = convertValue(fromNumber, fromUnit, toUnit, category);
            setToValue(result.toLocaleString('en-US', { maximumFractionDigits: 5 }));
        } else {
            setToValue('');
        }
    }, [fromValue, fromUnit, toUnit, category]);

    const handleFromValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFromValue(e.target.value);
    };

    return (
        <div className={styles.unitConverter}>
            <div>
                <Label htmlFor="category">Conversion Type</Label>
                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.keys(conversionOptions).map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            
            <div className={styles.unitConverterGrid}>
                <div>
                    <Label htmlFor="from-unit">From</Label>
                    <Select value={fromUnit} onValueChange={setFromUnit}>
                        <SelectTrigger id="from-unit">
                            <SelectValue placeholder="From unit" />
                        </SelectTrigger>
                        <SelectContent>
                            {currentUnits.map((unit) => (
                                <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input id="from-value" type="number" value={fromValue} onChange={handleFromValueChange} />
                </div>
                
                 <div>
                    <Label htmlFor="to-unit">To</Label>
                    <Select value={toUnit} onValueChange={setToUnit}>
                        <SelectTrigger id="to-unit">
                            <SelectValue placeholder="To unit" />
                        </SelectTrigger>
                        <SelectContent>
                            {currentUnits.map((unit) => (
                                <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input id="to-value" value={toValue} readOnly className="font-semibold bg-muted" />
                </div>
            </div>
             {category === 'Currency' && (
                <p className={styles.currencyNote}>
                    Currency rates are for demonstration purposes and may not be up-to-date.
                </p>
            )}
        </div>
    );
};

// --- Main Page Component ---
const CalculatorPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.calculatorWrapper}>
        <div className={styles.laptopFrame}>
            <div className={styles.screen}>
                 <Card className={styles.card}>
                    <CardHeader>
                        <CardTitle className="text-center text-2xl font-bold">Laptop Calculator</CardTitle>
                    </CardHeader>
                    <CardContent className={styles.cardContent}>
                        <Tabs defaultValue="calculator" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="calculator">Scientific</TabsTrigger>
                                <TabsTrigger value="converter">Unit Converter</TabsTrigger>
                            </TabsList>
                            <TabsContent value="calculator" className="pt-4">
                                <MainCalculator />
                            </TabsContent>
                            <TabsContent value="converter" className="pt-4">
                                <UnitConverter />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
        <div className={styles.laptopBase}>
             <div className={styles.laptopBaseDetail}></div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorPage;