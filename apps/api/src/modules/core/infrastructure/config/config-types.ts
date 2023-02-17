export type EnvValueValidator<InputType> = (value: InputType) => boolean;
export type EnvValueTransformer<InputType, OutputType> = (value: InputType) => OutputType;
