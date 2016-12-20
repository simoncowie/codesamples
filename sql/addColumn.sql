USE DB
GO

IF COL_LENGTH('Table','NewColumn') IS NULL
BEGIN
ALTER TABLE Table 
ADD NewColumn varchar(20) NULL
END

GO

--With default
ALTER TABLE Table 
ADD NewColumn bit NOT NULL DEFAULT(0)

GO