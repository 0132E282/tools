import React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { FormProvider } from 'react-hook-form';
import { FieldGroup } from '@/components/ui/field';
import type { FieldProps } from './field';
import Field from './field';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
    form: UseFormReturn<any, any, any>;
    onSubmit?: React.FormEventHandler<HTMLFormElement>;
    children: React.ReactNode;
    withFieldGroup?: boolean;
}

export function Form({
    form,
    onSubmit,
    children,
    className,
    withFieldGroup = true,
    ...props
}: FormProps) {
    return (
        <FormProvider {...form}>
            <form onSubmit={onSubmit} className={className} {...props}>
                {withFieldGroup ? (
                    <FieldGroup>{children}</FieldGroup>
                ) : (
                    children
                )}
            </form>
        </FormProvider>
    );
}

export type { FieldProps };
export { Field };
