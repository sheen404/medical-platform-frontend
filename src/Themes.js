import React from 'react';
import { createTheme, ThemeProvider, colors} from '@mui/material';

export const patientTheme = createTheme({
	palette:{
		primary:{
			main: '#DCE7D7',
			dark: '#A9C39E',
			contrastText: '#153D3C'
		},
		secondary:{
			main:'#F6B56B',
			dark:'#F1876F',
			
		}
	}
})

export const counselorTheme = createTheme({
	palette:{
		primary:{
			main: '#F2AD9C',
			dark: '#C8F8EA',
			contrastText: '#0C293E',
			light:'#84EFD0'
		},
		secondary:{
			main:'#3B5365',
			dark:'#F1876F',
			contrastText: '#FFFFFF',
		}
	}
})

export const doctorTheme = createTheme({
	palette:{
		primary:{
			main: '#7676FF',
			contrastText: '#FFFFFF',
			light: '#D9D9FF'
		},
		secondary:{
			main:'#FEFF89',
		}
	}
})

export const baseTheme = createTheme({
	palette:{
		primary:{
			main: '#6B6891',
			contrastText: '#FFFFFF'
			
		},
		secondary:{
			main:'#FFFFFF',
		}
	}
})