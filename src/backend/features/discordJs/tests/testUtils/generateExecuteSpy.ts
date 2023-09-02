;

export const generateExecuteSpy = (exportObject:any) => {
    
    const executeSpy = jest.spyOn(exportObject,"execute")

    return executeSpy
}