Steps:

1. Unencrypt the weapons folder (gotta do that outside this bot) found in aces.vromfs.bin
	I recommend using a batch file to run the unencrypter over all files.
	The files should have extensions ".blkx"
2. Run Initialization.ts
3. Once you have VISUAL confirmation that Initialization.ts is finished, run Main.ts
4. Completed files will be found in ./outputFiles
5. Repeated reruns of the bot without changing weapons folder does not require running Initialization.ts again.