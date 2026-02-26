@echo off
echo Updating all documentation files to use ADD instead of IMPORT...

REM Update all markdown files in docs/modules
powershell -Command "(Get-Content 'docs\modules\math_utils.md' -Raw) -replace 'IMPORT `"', 'ADD ' | Set-Content 'docs\modules\math_utils.md'"
powershell -Command "(Get-Content 'docs\modules\string_utils.md' -Raw) -replace 'IMPORT `"', 'ADD ' | Set-Content 'docs\modules\string_utils.md'"
powershell -Command "(Get-Content 'docs\modules\array_utils.md' -Raw) -replace 'IMPORT `"', 'ADD ' | Set-Content 'docs\modules\array_utils.md'"
powershell -Command "(Get-Content 'docs\modules\datetime_utils.md' -Raw) -replace 'IMPORT `"', 'ADD ' | Set-Content 'docs\modules\datetime_utils.md'"
powershell -Command "(Get-Content 'docs\modules\file_utils.md' -Raw) -replace 'IMPORT `"', 'ADD ' | Set-Content 'docs\modules\file_utils.md'"
powershell -Command "(Get-Content 'docs\modules\json_utils.md' -Raw) -replace 'IMPORT `"', 'ADD ' | Set-Content 'docs\modules\json_utils.md'"
powershell -Command "(Get-Content 'docs\modules\http_client.md' -Raw) -replace 'IMPORT `"', 'ADD ' | Set-Content 'docs\modules\http_client.md'"
powershell -Command "(Get-Content 'docs\modules\data_structures.md' -Raw) -replace 'IMPORT `"', 'ADD ' | Set-Content 'docs\modules\data_structures.md'"
powershell -Command "(Get-Content 'docs\modules\algorithms.md' -Raw) -replace 'IMPORT `"', 'ADD ' | Set-Content 'docs\modules\algorithms.md'"

echo Done! All documentation files updated to use ADD syntax.
pause
