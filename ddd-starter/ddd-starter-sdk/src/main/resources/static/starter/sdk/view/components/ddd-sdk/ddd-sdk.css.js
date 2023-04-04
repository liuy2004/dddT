'use strict'

const style = `
.ddd-sdk-outer {
    overflow: hidden;
    font-family: 'Consolas', sans-serif;
    display: flex;
    flex-direction: column;
    color: #fff;
    background-color: #000;
}
.ddd-sdk-outer .ddd-sdk-print,
.ddd-sdk-outer .ddd-sdk-command {
    position: relative;
    width: 100%;
    padding: 0 8px 0;
}
.ddd-sdk-outer .ddd-sdk-print {
    white-space: pre-wrap;
    overflow-y: auto;
    overflow-wrap: break-word;
}
.ddd-sdk-outer .ddd-sdk-command label {
    position: absolute;
}
.ddd-sdk-outer .ddd-sdk-command input,
.ddd-sdk-outer .ddd-sdk-command textarea {
    z-index: 2;
    font-family: 'Consolas', sans-serif;
    display: inline-block;
    line-height: 100%;
    color: #fff;
    background: none;
    border: 0;
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
}
.ddd-sdk-outer .ddd-sdk-command .ddd-sdk-command-placeholder {
    white-space: pre-wrap;
    color: rgba(255,255,255,0.5);
    pointer-events: none;
    position: absolute;
    background: none;
    left: 0;
}
`

export default style