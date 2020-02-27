### In this notebook, we create some dataframes from cleaned datasets to support data visualization.


```python
from pandas import DataFrame
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import warnings
warnings.filterwarnings("ignore")
```


```python
# list of countries
country_names = ["Australia","Canada","France","Germany","Italy","Japan","South Korea","Mexico","United Kingdom",
                 "United States", "Brazil","India","Indonesia","Russia","South Africa","Turkey","China","Argentina","Saudi Arabia"]
```


```python
years = ["2011","2012","2013","2014","2015","2016","total"] # get list of years 
```


```python
fields = ["Military","Health","Education"] # list of categories
```

### Total Expenditure by Military, Health, Education


```python
military_total = pd.read_csv("../data/cleaned data/military_total.csv") # read csv files
health_total = pd.read_csv("../data/cleaned data/health_total.csv")
education_total = pd.read_csv("../data/cleaned data/education_total.csv")
```


```python
total_spend = pd.DataFrame(index=np.arange(len(years)*len(country_names)),
                           columns = ["Country","Year","Military","Health","Education"]) # create a dataframe
```


```python
# retrieve the values for the dataframe from the 3 datasets above
for i in range (0, len(country_names)*len(years), len(country_names)):
    for j in range(0, len(country_names)):
        k = int(i/len(country_names))
        total_spend.ix[i + j, "Year"] = years[k]
        total_spend.ix[i + j, "Country"] = country_names[j]
        
        total_spend.ix[i + j, "Military"] = float(military_total[military_total.Country == country_names[j]][years[k]])
        
        total_spend.ix[i + j, "Health"] = float(health_total[health_total.Country == country_names[j]][years[k]])
        
        total_spend.ix[i + j, "Education"] = float(education_total[education_total.Country == country_names[j]][years[k]])
    
    
    
  
```


```python
total_spend.set_index(['Country','Year'], inplace = True) # set index
total_spend = total_spend / (10e+9) # change number format, in this case we want spending amount as billions 
total_spend.reset_index(drop=False, inplace=True)
```


```python
for i in ['Military','Health','Education']:
    total_spend[i] = total_spend[i].apply(lambda x: round(x, 2)) # round to two digits after decimal
```


```python
total_spend.to_csv(path_or_buf="../data/datasets/total_spend.csv", index = False) # save dataframe without index
```


```python
years = ["2011","2012","2013","2014","2015","2016"] # a new list of years excluding total
```

### Absolute Expenditure Growth


```python
# create a dataframe with defined columns and number of rows
total_spend_grow = pd.DataFrame(index=np.arange(len(years)*len(fields)),
                           columns = ["Field","Year","Australia","Canada","France","Germany","Italy","Japan","South Korea","Mexico","United Kingdom","United States",
                "Brazil","India","Indonesia","Russia","South Africa","Turkey","China","Argentina","Saudi Arabia"])
```


```python
# get the values for the dataframe
for i in range (0, len(fields)*len(years), len(years)):
    for j in range(0, len(years)):
        k = int(i/len(years))
        total_spend_grow.ix[i + j, "Field"] = fields[k]
        total_spend_grow.ix[i + j, "Year"] = years[j]
        for name in country_names:
            if total_spend_grow.ix[i + j, "Field"] == "Military":
                total_spend_grow.ix[i + j, name] = float(military_total[military_total.Country == name][years[j]])
            elif total_spend_grow.ix[i + j, "Field"] == "Health":
                total_spend_grow.ix[i + j, name] = float(health_total[military_total.Country == name][years[j]])
            else:
                total_spend_grow.ix[i + j, name] = float(education_total[military_total.Country == name][years[j]])
                
        
```


```python
total_spend_grow.set_index(['Field','Year'], inplace = True)
total_spend_grow = total_spend_grow / (10e+9)  # change format to billions
total_spend_grow.reset_index(drop=False, inplace=True)
for i in country_names:
    total_spend_grow[i] = total_spend_grow[i].apply(lambda x: round(x, 2)) # round to two digits after decimal
```


```python
total_spend_grow.to_csv(path_or_buf="../data/datasets/total_spend_grow.csv", index = False)
```

### Share of GDP


```python
military_pct = pd.read_csv("../data/cleaned data/military_pct.csv")
health_pct = pd.read_csv("../data/cleaned data/health_pct.csv")
education_pct = pd.read_csv("../data/cleaned data/education_pct.csv")
```


```python
shareGDP = pd.DataFrame(index=np.arange(len(years)*len(country_names)),
                           columns = ["Country","Year","Military","Health","Education"])
```


```python
for i in range (0, len(country_names)*len(years), len(country_names)):
    for j in range(0, len(country_names)):
        k = int(i/len(country_names))
        shareGDP.ix[i + j, "Year"] = years[k]
        shareGDP.ix[i + j, "Country"] = country_names[j]
        
        shareGDP.ix[i + j, "Military"] = float(military_pct[military_pct.Country == country_names[j]][years[k]])
        
        shareGDP.ix[i + j, "Health"] = float(health_pct[health_pct.Country == country_names[j]][years[k]])
        
        shareGDP.ix[i + j, "Education"] = float(education_pct[education_pct.Country == country_names[j]][years[k]])
    
```


```python
# get another column as average share of GDP for all 3 categories 
# row without education data will be ignored when calculating
shareGDP["Average"] = shareGDP[["Military","Health","Education"]].mean(1)
```


```python
shareGDP.set_index(['Country','Year'], inplace = True)
shareGDP = shareGDP * 100
for i in shareGDP.columns:
    shareGDP[i] = shareGDP[i].apply(lambda x: round(x, 2)) # when shown as % there will be 2 digits after decimal

shareGDP.reset_index(drop=False, inplace=True)
```


```python
shareGDP.to_csv(path_or_buf="../data/datasets/shareGDP.csv", index = False)
```

### Expenditure Per Capita


```python
military_pp = pd.read_csv("../data/cleaned data/military_pp.csv")
health_pp = pd.read_csv("../data/cleaned data/health_pp.csv")
education_pp = pd.read_csv("../data/cleaned data/education_pp.csv")
```


```python
capita_spend = pd.DataFrame(index=np.arange(len(years)*len(country_names)),
                           columns = ["Country","Year","Military","Health","Education"])
```


```python
for i in range (0, len(country_names)*len(years), len(country_names)):
    for j in range(0, len(country_names)):
        k = int(i/len(country_names))
        capita_spend.ix[i + j, "Year"] = years[k]
        capita_spend.ix[i + j, "Country"] = country_names[j]
        
        capita_spend.ix[i + j, "Military"] = float(military_pp[military_pp.Country == country_names[j]][years[k]])
        
        capita_spend.ix[i + j, "Health"] = float(health_pp[health_pp.Country == country_names[j]][years[k]])
        
        capita_spend.ix[i + j, "Education"] = float(education_pp[education_pp.Country == country_names[j]][years[k]])
    
```


```python
for i in ['Military','Health','Education']:
    capita_spend[i] = capita_spend[i].apply(lambda x: round(x, 2))
```


```python
capita_spend.to_csv(path_or_buf="../data/datasets/capita_spend.csv", index = False)
```

### Expenditure Change


```python
# read csv and save to dataframe
military_change = pd.read_csv("../data/cleaned data/military_change.csv")
health_change = pd.read_csv("../data/cleaned data/health_change.csv")
education_change = pd.read_csv("../data/cleaned data/education_change.csv")
```


```python
military_change['Field'] = "Military"   # adding another column that specify the field in each dataframe
health_change['Field'] = "Health"
education_change['Field'] = "Education"

```


```python
total_change = pd.concat([military_change,health_change,education_change]) # combine 3 dataframes into one
```


```python
total_change.set_index(['Country','Field'], inplace = True)
total_change = total_change/ (10e+6)  # format spending amount to millions
for i in total_change.columns:
    total_change[i] = total_change[i].apply(lambda x: round(x, 2)) # round to 2 digits after decimal

total_change.reset_index(drop=False, inplace=True)
```


```python
total_change.to_csv(path_or_buf="../data/datasets/total_change.csv", index = False)
```


```python
# in the next parts, we use similar methods to create datasets for visualization
```

### Pecentage Change


```python
military_change_pct = pd.read_csv("../data/cleaned data/military_change_pct.csv")
health_change_pct = pd.read_csv("../data/cleaned data/health_change_pct.csv")
education_change_pct = pd.read_csv("../data/cleaned data/education_change_pct.csv")
```


```python
military_change_pct['Field'] = "Military"
health_change_pct['Field'] = "Health"
education_change_pct['Field'] = "Education"
```


```python
pct_change = pd.concat([military_change_pct,health_change_pct,education_change_pct])
```


```python
pct_change.set_index(['Country','Field'], inplace = True)
for i in pct_change.columns:
    pct_change[i] = pct_change[i].apply(lambda x: round(x, 4))

pct_change.reset_index(drop=False, inplace=True)
```


```python
pct_change.to_csv(path_or_buf="../data/datasets/pct_change.csv", index = False)
```

### Total Expenditure by Years


```python
military_total['Field'] = "Military"
health_total['Field'] = "Health"
education_total['Field'] = "Education"
```


```python
total_spend_trend = pd.concat([military_total,health_total,education_total])
```


```python
total_spend_trend.set_index(['Country','Field'], inplace = True)
total_spend_trend = total_spend_trend/ (10e+9)
for i in total_spend_trend.columns:
    total_spend_trend[i] = total_spend_trend[i].apply(lambda x: round(x, 2))

total_spend_trend.reset_index(drop=False, inplace=True)
```


```python
total_spend_trend.to_csv(path_or_buf="../data/datasets/total_spend_trend.csv", index = False)
```

### Expenditure per Capita by Years


```python
military_pp['Field'] = "Military"
health_pp['Field'] = "Health"
education_pp['Field'] = "Education"
```


```python
capita_spend_trend = pd.concat([military_pp,health_pp,education_pp])
```


```python
capita_spend_trend.set_index(['Country','Field'], inplace = True)
for i in capita_spend_trend.columns:
    capita_spend_trend[i] = capita_spend_trend[i].apply(lambda x: round(x, 2))

capita_spend_trend.reset_index(drop=False, inplace=True)
```


```python
capita_spend_trend.to_csv(path_or_buf="../data/datasets/capita_spend_trend.csv", index = False)
```


```python
capita_spend_grow1 = pd.DataFrame(index=np.arange(len(years)*len(country_names)),
                           columns = ["Country","Year","Amount"])
capita_spend_grow2 = pd.DataFrame(index=np.arange(len(years)*len(country_names)),
                           columns = ["Country","Year","Amount"])
capita_spend_grow3 = pd.DataFrame(index=np.arange(len(years)*len(country_names)),
                           columns = ["Country","Year","Amount"])
```


```python
for i in range (0, len(country_names)*len(years), len(country_names)):
    for j in range(0, len(country_names)):
        k = int(i/len(country_names))
        capita_spend_grow1.ix[i + j, "Year"] = years[k]
        capita_spend_grow1.ix[i + j, "Country"] = country_names[j]
        
        capita_spend_grow1.ix[i + j, "Amount"] = float(military_pp[military_pp.Country == country_names[j]][years[k]])
        
for i in range (0, len(country_names)*len(years), len(country_names)):
    for j in range(0, len(country_names)):
        k = int(i/len(country_names))
        capita_spend_grow2.ix[i + j, "Year"] = years[k]
        capita_spend_grow2.ix[i + j, "Country"] = country_names[j]
        
        capita_spend_grow2.ix[i + j, "Amount"] = float(health_pp[health_pp.Country == country_names[j]][years[k]])
        
        
        
for i in range (0, len(country_names)*len(years), len(country_names)):
    for j in range(0, len(country_names)):
        k = int(i/len(country_names))
        capita_spend_grow3.ix[i + j, "Year"] = years[k]
        capita_spend_grow3.ix[i + j, "Country"] = country_names[j]
        
        capita_spend_grow3.ix[i + j, "Amount"] = float(education_pp[education_pp.Country == country_names[j]][years[k]])
        
        
```


```python
capita_spend_grow1["Field"] = "Military"
capita_spend_grow2["Field"] = "Health"
capita_spend_grow3["Field"] = "Education"

```


```python
capita_spend_grow = pd.concat([capita_spend_grow1, capita_spend_grow2, capita_spend_grow3])
```


```python
capita_spend_grow.to_csv(path_or_buf="../data/datasets/capita_spend_grow.csv", index = False)
```
