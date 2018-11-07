#!/usr/bin/env python
# Name: Amber Nobel
# Student number: 11819359
"""
This script visualizes data obtained from a .csv file
"""

import csv

import matplotlib
matplotlib.use("TkAgg")
import matplotlib.pyplot as plt

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018
LOWEST_RATING = 1
HIGHEST_RATING = 10


def parse(csvfile):
    ratings = {key: [] for key in range(START_YEAR, END_YEAR)}

    reader = csv.reader(csvfile)
    header = next(reader)

    for row in reader:
        ratings[int(row[2])].append(float(row[1]))

    return ratings


def compute_plot_data(ratings):
    year = list(ratings)
    rating = []

    for key in ratings:
        average = sum(ratings[key]) / len(ratings[key])
        rating.append(average)

    return year, rating


def plot_data(year, rating):
    plt.plot(year, rating)
    plt.axis([START_YEAR, END_YEAR, LOWEST_RATING, HIGHEST_RATING])
    plt.show()


def main():
    with open (INPUT_CSV, newline='') as csvfile:
        ratings = parse(csvfile)

    year, rating = compute_plot_data(ratings)

    plot_data(year, rating)



if __name__ == "__main__":
    main()
