```python
from pandas import DataFrame
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import warnings
warnings.filterwarnings("ignore")
```


```python
G20_codes = ["AUS","CAN","FRA","DEU","ITA","JPN","KOR","MEX","GBR","USA",
             "BRA","IND","IDN","RUS","ZAF","TUR","CHN","ARG","SAU"]
years = ["2011","2012","2013","2014","2015","2016"]
```


```python
country_names = ["Australia","Canada","France","Germany","Italy","Japan","South Korea","Mexico","United Kingdom","United States",
                "Brazil","India","Indonesia","Russia","South Africa","Turkey","China","Argentina","Saudi Arabia"]
```


```python
def read_data(data_path, header, index):
    df = pd.read_csv(data_path, header = header, index_col = index)
    df = df.loc[G20_codes, years]
    return df
    
```


```python
def change_abs(df):
    df1 = df.loc[:,["2012","2013","2014","2015","2016"]]
    df2 = df.loc[:,["2011","2012","2013","2014","2015"]]
    df2.columns = ["2012","2013","2014","2015","2016"]
    df_dif = df1 - df2
    df_dif["Annual Change"] = df_dif.loc[:,"2012":"2016"].mean(1)
    return df_dif

def change_pct(df):
    df1 = df.loc[:,["2012","2013","2014","2015","2016"]]
    df2 = df.loc[:,["2011","2012","2013","2014","2015"]]
    df2.columns = ["2012","2013","2014","2015","2016"]
    df_dif = df1 - df2
    df_dif_pct = df_dif / df2
    return df_dif_pct
    
```

### GDP


```python
GDP_total = read_data("../data/raw data/GDP.csv", 2, 1)
#GDP_total
```


```python
GDP_pp = read_data("../data/raw data/GDPpp.csv", 2, 1)
#GDP_pp
```

### Military Expenditure


```python
military_total = read_data("../data/raw data/Military.csv", 2, 1)
military_total["total"] = military_total.loc[:,years].sum(1)
#military_total
```


```python
military_pct = read_data("../data/raw data/Military%GDP.csv", 2, 1)
#military_pct
military_pct = military_pct / 100
```


```python
military_pp = GDP_pp * military_pct 
#military_pp
```


```python
military_change = change_abs(military_total)
#military_change
```


```python
military_change_pct = change_pct(military_total)
#military_change_pct
```

### Education Expenditure


```python
education_pct = read_data("../data/raw data/Education%GDP.csv", 2, 1)
#education_pct
education_pct = education_pct / 100
```


```python
education_total = GDP_total * education_pct 
education_total["total"] = education_total.loc[:,years].sum(1)
#education_total
```


```python
education_pp = GDP_pp * education_pct 
#education_pp
```


```python
education_change = change_abs(education_total)
#education_change
```


```python
education_change_pct = change_pct(education_total)
#education_change_pct
```

### Healthcare Expenditure


```python
health_pct = read_data("../data/raw data/Health%GDP.csv", 2, 1)
#health_pct
health_pct = health_pct / 100
```


```python
health_pp = read_data("../data/raw data/HealthPP.csv", 2, 1)
#health_pp
```


```python
health_total = GDP_total * health_pct
health_total["total"] = health_total.loc[:,years].sum(1)
#health_total
```


```python
health_change = change_abs(health_total)
#health_change
```


```python
health_change_pct = change_pct(health_total)
#health_change_pct
```

### Create cleaned data


```python
def update(df):
    df.index.names = ["Country"]
    df.reset_index(drop=False, inplace=True)
    for i in range(0,len(G20_codes)):
        df.ix[i,"Country"] = country_names[i]
    return df
```


```python
dict_df = {"GDP_total" : GDP_total, 
           "GDP_pp" : GDP_pp,
           "military_total" : military_total,
           "military_pp" : military_pp,
           "military_pct" : military_pct,
           "military_change" : military_change,
           "military_change_pct" : military_change_pct,
           "health_total" : health_total,
           "health_pp" : health_pp,
           "health_pct" : health_pct,
           "health_change" : health_change,
           "health_change_pct" : health_change_pct,
           "education_total" : education_total,
           "education_pp" : education_pp,
           "education_pct" : education_pct,
           "education_change" : education_change,
           "education_change_pct" : education_change_pct}
```


```python
for name, df in dict_df.items():
    dict_df[name] = update(dict_df[name])
    dict_df[name].to_csv(path_or_buf="../data/cleaned data/" + name + ".csv", index = False)
```
