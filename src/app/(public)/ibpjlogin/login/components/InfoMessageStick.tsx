interface InfoMessageStick {
  title?: string;
  subTitle?: string;
  type: 'success' | 'alert';
}

export function InfoMessageStick(props: InfoMessageStick) {
  const icon = props.type === 'success' ? 'box-confirma' : 'box-alert';

  return (
    <div className={icon}>
      <div id="mensagemLogoff" className="ctn-box after">
        <p className="text-[10.2px]">
          {props.title && <strong>{props.title}</strong>}
          {props.title && props.subTitle && <br />}
          {props.subTitle && props.subTitle}
        </p>
      </div>
    </div>
  );
}
