# Name: Amber Nobel
# Student number: 11819359
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib
import pandas

# Global constants for the input file, first and last year
INPUT_CSV = "input.csv"

with open (INPUT_CSV, newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        print(row['Region'])
