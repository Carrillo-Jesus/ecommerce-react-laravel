
import React, { useRef, useState, useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { FileUpload, FileUploadHeaderTemplateOptions, FileUploadSelectEvent, FileUploadUploadEvent, ItemTemplateOptions,} from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import { Demo } from '../../../../types/demo';

export default function SelectThumbnail({ updateThumbnail, product }: { updateThumbnail: (value: File | null) => void;  product: Demo.Product }) {
    const toast = useRef<Toast>(null);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef<FileUpload>(null);
    const [image, setImage] = useState<File | null>(null);

    useEffect(() => {
        const elements = document.querySelectorAll<HTMLElement>('.p-fluid .p-fileupload .p-button');

        if(elements) {
            elements.forEach((element: HTMLElement) => {
                    element.style.width = '3rem';
            });
        }

        const elementsCancel = document.querySelectorAll<HTMLElement>('.p-button.p-button-icon-only.p-button-rounded');

        if(elementsCancel) {
            elementsCancel.forEach((element: HTMLElement) => {
                    element.style.width = '3rem';
            });
        }
        
    }, [totalSize]);

    useEffect( () => {
        updateThumbnail(image);
    },[image])

    const onTemplateSelect = (e: FileUploadSelectEvent) => {
        let files = e.files;
        if (!files || files.length < 0) return;
        let _totalSize = totalSize;

        setImage(files[0]);
        _totalSize = files[0].size || 0;

        setTotalSize(_totalSize);
    };

    const onTemplateUpload = (e: FileUploadUploadEvent) => {
        let _totalSize = 0;

        e.files.forEach((file) => {
            _totalSize += file.size || 0;
        });

        setTotalSize(_totalSize);
        toast.current?.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };

    const onTemplateRemove = (file: File, callback: Function) => {
        setImage(null);
        setTotalSize(0);
        callback();
    };

    const onTemplateClear = () => {
        setTotalSize(0);
        setImage(null);
    };

    const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 30000;
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {/* {uploadButton} */}
                {/* {cancelButton} */}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span>{formatedValue} / 3 MB</span>
                    <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
                </div>
            </div>
        );
    };

    const itemTemplate = (inFile: any, props: ItemTemplateOptions) => {
        const file = inFile ;
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
                    {/* <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span> */}
                </div>
                {/* <Tag value={props.formatSize} severity="warning" className="px-3 py-2" /> */}
                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
                <div className="flex align-items-center flex-column">
                    <i className="pi pi-image mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
                    <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                            Arrastra y suelta la imagen Miniatura aquí
                    </span>
                </div>
        );
    };

    const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

    return (
        <div className='w-100'>
            <Toast ref={toast}></Toast>

            <Tooltip target=".custom-choose-btn" content="Agregar" position="bottom" />
            {/* <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" /> */}
            <Tooltip target=".custom-cancel-btn" content="Limpiar" position="bottom" />

            <FileUpload ref={fileUploadRef}  multiple={false} name="demo[]" url="/api/upload" accept="image/*" maxFileSize={3000000}
                onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
                headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
                chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions} />
        </div>
    )
}
        