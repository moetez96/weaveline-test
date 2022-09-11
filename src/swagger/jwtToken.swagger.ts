import { ApiProperty } from "@nestjs/swagger";

export class AccessToken {
    @ApiProperty({
        description: 'The user access token',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzMWNlNDA0NDFkOTMxODdkZTg3MTU0OCIsImZ1bGxOYW1lIjoiTW9ldGV6IEF5YXJpIiwiaWF0IjoxNjYyODQyNjQ0LCJleHAiOjE2NjI5MjkwNDR9.w3TA1JukWFgd-LX_Jw52b4jLBJDQLMq-iHBNAlyMQKA'
    })
    accessToken: string
}