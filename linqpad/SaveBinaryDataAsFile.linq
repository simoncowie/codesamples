//Set Language to "C# Program" in linqPad

void Main()
{
	var peopleWithPics =  TblPersons  
				.Where(p => p.ProfilePicture != null)
				.Select(p => new { p.PersonID, p.ProfilePicture });
 
 	foreach(var p in peopleWithPics) 
	{
  		System.IO.File.WriteAllBytes(
			Path.Combine(@"D:\temp\", p.PersonID.ToString() + ".jpg"), 
   				p.ProfilePicture.ToArray());
   	}
}