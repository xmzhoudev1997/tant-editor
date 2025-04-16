// @ts-nocheck
import { ShellEditor } from '@tant/editor';
import React, { useEffect, useRef } from 'react';
import './index.less';
import { Button } from '@tant/ui-next';
import { TaPlay } from '@tant/icons';
import { registerEditor } from '@tant/editor';

// registerEditor();
export default () => {
  const editorRef = useRef(null);
  return (
    <ShellEditor
      className="tant-editor-demo"
      onEditorChange={(d) => {
        editorRef.current = d
      }}
      value={`
        #!/bin/bash
# Simple line count example, using bash
#
# Bash tutorial: http://linuxconfig.org/Bash_scripting_Tutorial#8-2-read-file-into-bash-array
# My scripting link: http://www.macs.hw.ac.uk/~hwloidl/docs/index.html#scripting
#
# Usage: ./line_count.sh file
# -----------------------------------------------------------------------------

# Link filedescriptor 10 with stdin
exec 10<&0
# stdin replaced with a file supplied as a first argument
exec < $1
# remember the name of the input file
in=$1
# init
file="current_line.txt"
let count=0

# this while loop iterates over all lines of the file
while read LINE
do
    # increase line counter
    ((count++))
    # write current line to a tmp file with name $file (not needed for counting)
    echo $LINE > $file
    # this checks the return code of echo (not needed for writing; just for demo)
    if [ $? -ne 0 ]
     then echo "Error in writing to file \${file}; check its permissions!"
    fi
done

echo "Number of lines: $count"
echo "The last line of the file is: \`cat \${file}\`"

# Note: You can achieve the same by just using the tool wc like this
echo "Expected number of lines: \`wc -l $in\`"

# restore stdin from filedescriptor 10
# and close filedescriptor 10
exec 0<&10 10<&-
        `}
      initOptions={{
        // theme: 'tant-dark'
      }}
      theme="vs-light"
      onContextMenuChange={(key) => {
        if (key === 'format' && editorRef.current?.format) {
          editorRef.current.format();
        }
      }}
    />
  );
}