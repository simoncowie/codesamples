//Grab the build.ps1 file from Cake github at https://github.com/cake-build/resources

///Add ins... 
//#addin "Cake.Slack"
///Tools
//#tool nuget:?package=NUnit.ConsoleRunner&version=3.4.0
//////////////////////////////////////////////////////////////////////
// ARGUMENTS
//////////////////////////////////////////////////////////////////////

var target = Argument("target", "Default");
var configuration = Argument("configuration", "Release");
//Set which site to publish. Default to API.
var publishSite = Argument("publishsite", "ExProjectAPI");

//////////////////////////////////////////////////////////////////////
// PREPARATION
//////////////////////////////////////////////////////////////////////

// Define files and directories.
var solution = File("./ExProject/ExProject.sln");
var publishDir = Directory("./publish/") + Directory(publishSite);

//////////////////////////////////////////////////////////////////////
// TASKS
//////////////////////////////////////////////////////////////////////

Task("Clean")
    .Does(() =>
{
    CleanDirectories("./ExProject/**/bin/");
    CleanDirectories("./ExProject/**/obj/");
});

Task("Restore-NuGet-Packages")
    .Does(() =>
{
    NuGetRestore(solution);
});

Task("Build")
    .IsDependentOn("Restore-NuGet-Packages")
    .IsDependentOn("Clean")
    .Does(() =>
{
    // Use MSBuild
    MSBuild(solution, settings =>
        settings.SetConfiguration(configuration)
        .SetVerbosity(Verbosity.Minimal));
});

Task("Package")
    .IsDependentOn("Build")
    .Does(() =>
{
    CleanDirectory(publishDir); 

    var deploySiteToken = "Deploy" + publishSite;
    var fullDir = publishDir + Directory(configuration);
    
    Information("Packing site: " + deploySiteToken);
    Information("Publishing site to: " + fullDir);
    
    // Use MSBuild
    MSBuild(solution, settings =>
        settings.SetConfiguration(configuration)
        //.WithProperty("OutputPath", "$(OutputRoot)")
        .WithProperty("WebPublishMethod", "FileSystem")
        .WithProperty(deploySiteToken, "true")
        .WithProperty("DeployTarget", "WebPublish")
        .WithProperty("publishUrl", MakeAbsolute(fullDir).FullPath)
		.SetVerbosity(Verbosity.Minimal));
});

//////////////////////////////////////////////////////////////////////
// TASK TARGETS
//////////////////////////////////////////////////////////////////////

 Task("Default")
     .IsDependentOn("Build");

//////////////////////////////////////////////////////////////////////
// EXECUTION
//////////////////////////////////////////////////////////////////////

RunTarget(target);