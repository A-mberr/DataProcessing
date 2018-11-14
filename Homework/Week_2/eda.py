# Name: Amber Nobel
# Student number: 11819359
"""
This script visualizes data obtained from a .csv file
"""

import matplotlib
import pandas as pd
import numpy as np
matplotlib.use('TkAgg')
import matplotlib.pyplot as plt
import json

# Global constants for the input file, first and last year
df = pd.read_csv('input.csv')

GDP = 'GDP ($ per capita) dollars'
infant_mort = 'Infant mortality (per 1000 births)'
pop_dens = 'Pop. Density (per sq. mi.)'

# includes only the columns of Country, Region, GDP, infant mortality,
# population density
df = df[['Country', 'Region', GDP, infant_mort, pop_dens]]

# adjust GDP column to the right format
df[GDP] = df[GDP].str.strip(' dollars')
df[GDP] = df[GDP].replace({'unknown': np.nan})
df[GDP] = pd.to_numeric(df[GDP])

# adjust Region column to the right format
df['Region'] = df['Region'].str.strip()

# adjust infant mortality column to the right format
df[infant_mort] = df[infant_mort].str.replace(',', '.')
df[infant_mort] = pd.to_numeric(df[infant_mort])

# adjust population density column to the right format
df[pop_dens] = df[pop_dens].str.replace(',', '.')
df[pop_dens] = df[pop_dens].replace({'unknown': np.nan})
df[pop_dens] = pd.to_numeric(df[pop_dens])

# print the mean, median, mode and standard deviation of GDP
print('Mean GDP:', df[GDP].mean())
print('Median GDP:', df[GDP].median())
print('Mode GDP:', df[GDP].mode())
print('STD GDP:', df[GDP].std())

# gives the values of count, mean, std, min, 25%, 50%, 75% and max of
# infant mortality
print(df[infant_mort].describe())
boxplot = df.boxplot(column=[infant_mort])
plt.title('Infant mortality data')
# plt.show()

# creates histogram based on the data of de GDP
hist = df[GDP].hist(bins='auto')
plt.title('GDP data')
# plt.show()

# creates json with the country as index
data = df.set_index('Country').to_json(orient='index')
print(data)

# saves the data as a json file
with open('data.json', 'w') as outfile:
    json.dump(data, outfile)
