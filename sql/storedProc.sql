USE DB
GO

CREATE PROCEDURE dbo.spMySpName 
	@param1 int,
	@param2 int,
	@paramWithDefault nvarchar(20) = null
AS
BEGIN 
	DECLARE @someVar nvarchar(100); 
	
	SELECT @someVar = name 
	FROM table 
	WHERE id = @param2;
    
    --basic if
	IF (@someVar is null)
	BEGIN 
	    --basic print error and exit
		PRINT N'Error: someVar not found!';
		RETURN(1);
	END
	
	DECLARE @anotherthing nvarchar(128);
	SET @anotherthing = @paramWithDefault + ' ' + @someVar;
	
    -- if exists example
	IF EXISTS (Select * from [users] where UserId = @param2 and someThing = @anotherthing)
	BEGIN
		PRINT N'Error: This user already exists!';
		RETURN(1);
	END

    -- an insert
	INSERT INTO [users] (UserId, Something)
	VALUES (@param2,@anotherthing);

    --SUCCESS
	DECLARE @PrintMessage nvarchar(100);  
	SET @PrintMessage = N'Success: ' +   @ProviderKey 
		+ N' added to the UserLogins table';
			
	PRINT @PrintMessage;  

    RETURN(0);
END	