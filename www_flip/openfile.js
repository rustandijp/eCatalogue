function WriteFile()
{

    var fh = fopen("c:\myFile.txt", 3); // Open the file for writing
alert(fh);
    if(fh!=-1) // If the file has been successfully opened
    {
        var str = "Some text goes here...";
		alert(str);
        fwrite(fh, str); // Write the string to a file
        fclose(fh); // Close the file
    }

}
WriteFile();