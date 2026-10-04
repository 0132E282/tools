import { Head } from '@inertiajs/react';
import { Form, Field } from '@/components/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppForm, z } from '@/hooks/use-app-form';

const confirmPasswordSchema = z.object({
    password: z.string().min(1, 'Password is required'),
});

type ConfirmPasswordValues = z.infer<typeof confirmPasswordSchema>;

export default function ConfirmPassword() {
    const form = useAppForm<ConfirmPasswordValues>({
        schema: confirmPasswordSchema,
        defaultValues: {
            password: '',
        },
    });

    const {
        formState: { isSubmitting },
    } = form;

    const onSubmit = form.submit('/user/confirm-password', 'post');

    return (
        <div className="flex flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-md">
                <Head title="Secure Area" />

                <Card className="overflow-hidden p-0">
                    <CardContent className="p-0">
                        <Form
                            form={form}
                            onSubmit={onSubmit}
                            className="p-6 md:p-8"
                        >
                            <div className="text-muted-foreground mb-6 text-center text-sm">
                                This is a secure area of the application. Please
                                confirm your password before continuing.
                            </div>

                            <Field
                                name="password"
                                ui="input"
                                type="password"
                                label="Password"
                                autoComplete="current-password"
                                autoFocus
                            />

                            <div className="mt-6 flex justify-end">
                                <Button
                                    disabled={isSubmitting}
                                    className="w-full"
                                >
                                    {isSubmitting
                                        ? 'Confirming...'
                                        : 'Confirm Password'}
                                </Button>
                            </div>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
