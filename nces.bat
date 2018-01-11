if not DEFINED IS_MINIMIZED set IS_MINIMIZED=1 && start "" /min "%~dpnx0" %* && exit
set PYTHON_PATH=c:\Unzip\tools\Miniconda\envs\tensorflow
node nces.js
rem pause
exit
