//Set Language to "C# Program" in linqPad

void Main()
{

	var file = System.IO.File.ReadAllBytes(@"D:\temp\4980.jpg");
	
	var person = TblPersons.First(p => p.PersonID == 5025);
	
	person.ProfilePicture = file;
	
	SubmitChanges();
	
}