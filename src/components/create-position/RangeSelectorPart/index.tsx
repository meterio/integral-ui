import { useCallback, useEffect, useState } from 'react';
import { Price, Token } from "@cryptoalgebra/integral-sdk";
import { useMintState } from "@/state/mintStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface RangeSelectorPartProps {
    value: string;
    onUserInput: (value: string) => void;
    decrement: () => string;
    increment: () => string;
    decrementDisabled?: boolean;
    incrementDisabled?: boolean;
    label?: string;
    width?: string;
    locked?: boolean;
    initialPrice: Price<Token, Token> | undefined;
    disabled: boolean;
    title: string;
}

const RangeSelectorPart = ({
    value,
    decrement,
    increment,
    decrementDisabled = false,
    incrementDisabled = false,
    locked,
    onUserInput,
    disabled,
    title,
}: RangeSelectorPartProps) => {
    const [localUSDValue, setLocalUSDValue] = useState('');
    const [localTokenValue, setLocalTokenValue] = useState('');

    const {
        initialTokenPrice,
        actions: { updateSelectedPreset },
    } = useMintState();

    const handleOnBlur = useCallback(() => {
        onUserInput(localTokenValue);
    }, [localTokenValue, localUSDValue, onUserInput]);

    const handleDecrement = useCallback(() => {
        onUserInput(decrement());
    }, [decrement, onUserInput]);

    const handleIncrement = useCallback(() => {
        onUserInput(increment());
    }, [increment, onUserInput]);

    useEffect(() => {
        if (value) {
            setLocalTokenValue(value);
            if (value === '∞') {
                setLocalUSDValue(value);
                return;
            }
        } else if (value === '') {
            setLocalTokenValue('');
            setLocalUSDValue('');
        }
    }, [initialTokenPrice, value]);

    return (
        <div>
            <div className="flex mb-2 font-bold text-md">
                {title}
            </div>
            <div className="flex relative">
                <Button onClick={handleDecrement} disabled={decrementDisabled || disabled} className="border border-card-border rounded-xl rounded-r-none">
                    -
                </Button>

                <Input
                    type={'text'}
                    value={localTokenValue}
                    id={title}
                    onBlur={handleOnBlur}
                    disabled={disabled || locked}
                    onChange={val => {
                        setLocalTokenValue(val.target.value.trim())
                        updateSelectedPreset(null)
                    }}
                    placeholder={'0.00'}
                    className="border-y border-x-0 border-card-border rounded-none"
                />

                <Button onClick={handleIncrement} disabled={incrementDisabled || disabled} className="border border-card-border rounded-xl rounded-l-none">
                    +
                </Button>
            </div>
        </div>
    );
};

export default RangeSelectorPart;