export class FooterButtonModel {
    label: string;

    onClick: Function;

    disabled: boolean = false;

    constructor(label: string, onClick: Function) {
        this.label = label;
        this.onClick = onClick;
    }
}
