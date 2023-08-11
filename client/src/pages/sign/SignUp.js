import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext';
import customTheme from '../../theme/theme'
import { CssVarsProvider } from "@mui/joy/styles";
import { Box, Typography, Card, Container, Grid, FormControl, FormLabel, Input, Button, Divider } from '@mui/joy'
import GoogleIcon from './GoogleIcon'

function SignUp() {
    const navigate = useNavigate();
    const [error, setError] = useState();
    const { dispatch } = useAuthContext();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formElements = event.currentTarget.elements;
        const formData = {
            email: formElements.email.value,
            password: formElements.password.value,
            lastname: formElements.lastname.value,
            firstname: formElements.firstname.value,
        };

        try {
            const res = await fetch('/api/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if(data.error){
                setError(data.error);
            }
            if(data.user){
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('shop', JSON.stringify(data.shop));
                dispatch({type: 'LOGIN', payload: {user: data.user, shop: data.shop}});
                navigate("../");
            }
        }catch (err) {
            console.log(err);
        }
    }

    return (
        <CssVarsProvider theme={customTheme}>
            <Container maxWidth="xs">
                <Box sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <Card variant='outlined'>
                        <Typography level='h3' component="h1" textAlign="center">Sign up</Typography>
                        <Box component="form" onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid xs={12} sm={6}>
                                    <FormControl required>
                                        <FormLabel>Last Name</FormLabel>
                                        <Input type="text" name="lastname" />
                                    </FormControl>
                                </Grid>
                                <Grid xs={12} sm={6}>
                                    <FormControl required>
                                        <FormLabel>First Name</FormLabel>
                                        <Input type="text" name="firstname" />
                                    </FormControl>
                                </Grid>
                                <Grid xs={12}>
                                    <FormControl required>
                                        <FormLabel>Email</FormLabel>
                                        <Input type="email" name="email" />
                                    </FormControl>
                                </Grid>
                                <Grid xs={12}>
                                    <FormControl required>
                                        <FormLabel>Password</FormLabel>
                                        <Input type="password" name="password" slotProps={{ input: { 'pattern': '.{8,}', 'title': 'Mật khẩu phải chứa ít nhất 8 kí tự' } }} />
                                    </FormControl>
                                </Grid>
                            </Grid>
                            {error && <Typography variant="plain" color='danger' sx={{mt:3}}>{`*${error}`}</Typography>}
                            <Button fullWidth type="submit" variant="solid" sx={{ my: 3 }}>Register</Button>
                            <Divider><Typography fontWeight="lg">Or continue with</Typography></Divider>
                            <Button variant="outlined" color="neutral" fullWidth startDecorator={<GoogleIcon />} sx={{ mt: 3, mb: 2 }}>
                                Sign in with Google
                            </Button>
                        </Box>
                    </Card>
                </Box>

            </Container>
        </CssVarsProvider>
    )
}

export default SignUp